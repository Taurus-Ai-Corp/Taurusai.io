import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, Eye, BookTemplate } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RichTextEditor from "@/components/RichTextEditor";
import TemplateBrowser from "@/components/TemplateBrowser";

interface SequenceEditorProps {
  sequenceId?: number | null;
  onClose: () => void;
  onSave: () => void;
}

interface EmailStep {
  id?: number;
  stepNumber: number;
  delayDays: number;
  subject: string;
  body: string;
  abTestEnabled?: boolean;
  variantSubject?: string | null;
  variantBody?: string | null;
}

export default function SequenceEditor({ sequenceId, onClose, onSave }: SequenceEditorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetScoreMin, setTargetScoreMin] = useState(0);
  const [targetScoreMax, setTargetScoreMax] = useState(100);
  const [targetStatus, setTargetStatus] = useState<string | null>("new");
  const [isActive, setIsActive] = useState(true);
  const [emails, setEmails] = useState<EmailStep[]>([]);
  const [previewEmail, setPreviewEmail] = useState<EmailStep | null>(null);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);

  const { data: existingSequence } = trpc.sequences.getById.useQuery(
    { id: sequenceId! },
    { enabled: !!sequenceId }
  );

  const createSequence = trpc.sequences.create.useMutation();
  const updateSequence = trpc.sequences.update.useMutation();
  const createEmail = trpc.sequences.createEmail.useMutation();
  const updateEmail = trpc.sequences.updateEmail.useMutation();
  const deleteEmail = trpc.sequences.deleteEmail.useMutation();

  useEffect(() => {
    if (existingSequence) {
      setName(existingSequence.name || "");
      setDescription(existingSequence.description || "");
      setTargetScoreMin(existingSequence.targetScoreMin || 0);
      setTargetScoreMax(existingSequence.targetScoreMax || 100);
      setTargetStatus(existingSequence.targetStatus || "new");
      setIsActive(existingSequence.isActive || false);
      setEmails(existingSequence.emails || []);
    }
  }, [existingSequence]);

  const handleAddEmail = () => {
    const newStep: EmailStep = {
      stepNumber: emails.length + 1,
      delayDays: emails.length === 0 ? 0 : 7,
      subject: "",
      body: "",
    };
    setEmails([...emails, newStep]);
  };

  const handleRemoveEmail = async (index: number) => {
    const email = emails[index];
    if (email.id) {
      try {
        await deleteEmail.mutateAsync({ id: email.id });
      } catch (error) {
        toast.error("Failed to delete email");
        return;
      }
    }
    
    const newEmails = emails.filter((_, i) => i !== index);
    // Renumber steps
    const renumbered = newEmails.map((e, i) => ({ ...e, stepNumber: i + 1 }));
    setEmails(renumbered);
  };

  const handleUpdateEmail = (index: number, field: keyof EmailStep, value: any) => {
    const newEmails = [...emails];
    newEmails[index] = { ...newEmails[index], [field]: value };
    setEmails(newEmails);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a sequence name");
      return;
    }

    if (targetScoreMin > targetScoreMax) {
      toast.error("Minimum score cannot be greater than maximum score");
      return;
    }

    try {
      let currentSequenceId = sequenceId;

      // Create or update sequence
      if (sequenceId) {
        await updateSequence.mutateAsync({
          id: sequenceId,
          name,
          description,
          targetScoreMin,
          targetScoreMax,
          targetStatus: targetStatus as any,
          isActive,
        });
      } else {
        const result = await createSequence.mutateAsync({
          name,
          description,
          targetScoreMin,
          targetScoreMax,
          targetStatus: targetStatus as any,
          isActive,
        });
        currentSequenceId = result.id;
      }

      // Save all emails
      for (const email of emails) {
        if (email.id) {
          await updateEmail.mutateAsync({
            id: email.id,
            stepNumber: email.stepNumber,
            delayDays: email.delayDays,
            subject: email.subject,
            body: email.body,
            abTestEnabled: email.abTestEnabled || false,
            variantSubject: email.variantSubject || null,
            variantBody: email.variantBody || null,
          });
        } else if (currentSequenceId) {
          await createEmail.mutateAsync({
            sequenceId: currentSequenceId,
            stepNumber: email.stepNumber,
            delayDays: email.delayDays,
            subject: email.subject,
            body: email.body,
            abTestEnabled: email.abTestEnabled || false,
            variantSubject: email.variantSubject || null,
            variantBody: email.variantBody || null,
          });
        }
      }

      toast.success(sequenceId ? "Sequence updated successfully" : "Sequence created successfully");
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to save sequence: ${error.message}`);
    }
  };

  const renderEmailPreview = (email: EmailStep) => {
    // Replace template variables with sample data
    const sampleData = {
      firstName: "John",
      lastName: "Doe",
      company: "Acme Corp",
      industry: "Technology",
    };

    let previewSubject = email.subject;
    let previewBody = email.body;

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });

    return { subject: previewSubject, body: previewBody };
  };

  return (
    <div className="space-y-6">
      {/* Sequence Settings */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Sequence Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., High-Priority Lead Nurture"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this sequence..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scoreMin">Minimum Score</Label>
            <Input
              id="scoreMin"
              type="number"
              min="0"
              max="100"
              value={targetScoreMin}
              onChange={(e) => setTargetScoreMin(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="scoreMax">Maximum Score</Label>
            <Input
              id="scoreMax"
              type="number"
              min="0"
              max="100"
              value={targetScoreMax}
              onChange={(e) => setTargetScoreMax(parseInt(e.target.value) || 100)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Target Lead Status</Label>
          <Select value={targetStatus || "new"} onValueChange={setTargetStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="active">Active (sequence will run automatically)</Label>
        </div>
      </div>

      {/* Email Steps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Email Steps</h3>
          <div className="flex gap-2">
            <Button onClick={() => setShowTemplateBrowser(true)} size="sm" variant="outline">
              <BookTemplate className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
            <Button onClick={handleAddEmail} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </Button>
          </div>
        </div>

        {emails.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No emails yet. Click "Add Email" to create your first step.
          </Card>
        ) : (
          <div className="space-y-4">
            {emails.map((email, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Step</Label>
                          <div className="font-semibold">{email.stepNumber}</div>
                        </div>
                        <div>
                          <Label htmlFor={`delay-${index}`} className="text-xs">
                            Delay (days)
                          </Label>
                          <Input
                            id={`delay-${index}`}
                            type="number"
                            min="0"
                            value={email.delayDays}
                            onChange={(e) =>
                              handleUpdateEmail(index, "delayDays", parseInt(e.target.value) || 0)
                            }
                            className="w-20"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPreviewEmail(email)}
                          title="Preview email"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveEmail(index)}
                          title="Remove email"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`subject-${index}`}>Subject Line</Label>
                      <Input
                        id={`subject-${index}`}
                        value={email.subject}
                        onChange={(e) => handleUpdateEmail(index, "subject", e.target.value)}
                        placeholder="e.g., Welcome to {{company}}"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use variables: {"{"}
                        {"{"}firstName{"}"}
                        {"}"}, {"{"}
                        {"{"}lastName{"}"}
                        {"}"}, {"{"}
                        {"{"}company{"}"}
                        {"}"}, {"{"}
                        {"{"}industry{"}"}
                        {"}"}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor={`body-${index}`}>Email Body</Label>
                      <RichTextEditor
                        value={email.body}
                        onChange={(value) => handleUpdateEmail(index, "body", value)}
                        placeholder="Enter email content..."
                      />
                    </div>

                    {/* A/B Testing */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id={`ab-test-${index}`}
                          checked={email.abTestEnabled || false}
                          onCheckedChange={(checked) => handleUpdateEmail(index, "abTestEnabled", checked)}
                        />
                        <Label htmlFor={`ab-test-${index}`} className="font-semibold">
                          Enable A/B Testing (50/50 split)
                        </Label>
                      </div>

                      {email.abTestEnabled && (
                        <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                          <div>
                            <Label htmlFor={`variant-subject-${index}`}>Variant B Subject Line</Label>
                            <Input
                              id={`variant-subject-${index}`}
                              value={email.variantSubject || ""}
                              onChange={(e) => handleUpdateEmail(index, "variantSubject", e.target.value)}
                              placeholder="Alternative subject line..."
                            />
                          </div>

                          <div>
                            <Label htmlFor={`variant-body-${index}`}>Variant B Body</Label>
                            <RichTextEditor
                              value={email.variantBody || ""}
                              onChange={(value) => handleUpdateEmail(index, "variantBody", value)}
                              placeholder="Alternative email content..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {sequenceId ? "Update Sequence" : "Create Sequence"}
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview (with sample data)</DialogTitle>
          </DialogHeader>
          {previewEmail && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Subject:</Label>
                <div className="font-medium mt-1">{renderEmailPreview(previewEmail).subject}</div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Body:</Label>
                <div
                  className="mt-2 border rounded p-4 bg-white text-black max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: renderEmailPreview(previewEmail).body }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Browser */}
      <TemplateBrowser
        open={showTemplateBrowser}
        onClose={() => setShowTemplateBrowser(false)}
        onSelect={(template) => {
          handleAddEmail();
          const newIndex = emails.length;
          setEmails(prev => {
            const updated = [...prev];
            updated[newIndex] = {
              ...updated[newIndex],
              subject: template.subject,
              body: template.body,
            };
            return updated;
          });
        }}
      />
    </div>
  );
}
