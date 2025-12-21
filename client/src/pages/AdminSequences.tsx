import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import SequenceEditor from "@/components/SequenceEditor";

export default function AdminSequences() {
  const [selectedSequenceId, setSelectedSequenceId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: sequences, isLoading, refetch } = trpc.sequences.getAll.useQuery();
  const { data: selectedSequence } = trpc.sequences.getById.useQuery(
    { id: selectedSequenceId! },
    { enabled: !!selectedSequenceId }
  );

  const updateSequence = trpc.sequences.update.useMutation({
    onSuccess: () => {
      toast.success("Sequence updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update sequence: ${error.message}`);
    },
  });

  const deleteSequence = trpc.sequences.delete.useMutation({
    onSuccess: () => {
      toast.success("Sequence deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete sequence: ${error.message}`);
    },
  });

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    await updateSequence.mutateAsync({
      id,
      isActive: !currentStatus,
    });
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      await deleteSequence.mutateAsync({ id });
    }
  };

  const getPriorityLabel = (min: number, max: number) => {
    if (min >= 60) return { label: "High Priority", color: "bg-red-500" };
    if (min >= 40) return { label: "Medium Priority", color: "bg-yellow-500" };
    return { label: "Low Priority", color: "bg-blue-500" };
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading sequences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Email Sequences</h1>
          <p className="text-muted-foreground mt-2">
            Manage automated email campaigns for lead nurturing
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Sequence
        </Button>
      </div>

      {!sequences || sequences.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground mb-4">No email sequences found</div>
          <Button onClick={() => setIsEditorOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Sequence
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sequences.map((sequence) => {
            const priority = getPriorityLabel(sequence.targetScoreMin || 0, sequence.targetScoreMax || 100);
            
            return (
              <Card key={sequence.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{sequence.name}</h3>
                      <Badge className={priority.color}>{priority.label}</Badge>
                      {sequence.isActive ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          <Power className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-500">
                          <PowerOff className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{sequence.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Score Range</div>
                        <div className="font-medium">
                          {sequence.targetScoreMin} - {sequence.targetScoreMax}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Target Status</div>
                        <div className="font-medium">{sequence.targetStatus || "Any"}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Created</div>
                        <div className="font-medium">
                          {new Date(sequence.createdAt!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedSequenceId(sequence.id!);
                        setIsPreviewOpen(true);
                      }}
                      title="Preview emails"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedSequenceId(sequence.id!);
                        setIsEditorOpen(true);
                      }}
                      title="Edit sequence"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleActive(sequence.id!, sequence.isActive!)}
                      title={sequence.isActive ? "Deactivate" : "Activate"}
                    >
                      {sequence.isActive ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(sequence.id!, sequence.name!)}
                      title="Delete sequence"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Sequence Preview</DialogTitle>
          </DialogHeader>
          
          {selectedSequence && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedSequence.name}</h3>
                <p className="text-muted-foreground">{selectedSequence.description}</p>
              </div>

              <div className="space-y-4">
                {selectedSequence.emails && selectedSequence.emails.length > 0 ? (
                  selectedSequence.emails.map((email, index) => (
                    <Card key={email.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="outline">Step {email.stepNumber}</Badge>
                          <span className="text-sm text-muted-foreground ml-2">
                            Day {email.delayDays}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-sm text-muted-foreground mb-1">Subject:</div>
                        <div className="font-medium">{email.subject}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Body Preview:</div>
                        <div 
                          className="border rounded p-3 bg-muted/30 text-sm max-h-40 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: email.body }}
                        />
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No emails in this sequence yet
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={(open) => {
        setIsEditorOpen(open);
        if (!open) setSelectedSequenceId(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSequenceId ? "Edit Sequence" : "Create New Sequence"}
            </DialogTitle>
          </DialogHeader>
          <SequenceEditor
            sequenceId={selectedSequenceId}
            onClose={() => {
              setIsEditorOpen(false);
              setSelectedSequenceId(null);
            }}
            onSave={() => {
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
