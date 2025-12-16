import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import InvestorRelations from "./pages/InvestorRelations";
import PressCenter from "./pages/PressCenter";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import LiveChat from "./components/LiveChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={Products} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/case-studies/:slug" component={CaseStudies} />
      <Route path="/insights" component={Blog} />
      <Route path="/insights/:slug" component={BlogPost} />
      <Route path="/investors" component={InvestorRelations} />
      <Route path="/press" component={PressCenter} />
      <Route path="/contact" component={Contact} />
      <Route path="/demo" component={Contact} />
      <Route path="/search" component={Search} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <LiveChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
