# Aretiico Workflow Pattern

This document describes the standardized pattern for building workflow prototypes in the Aretiico customer portal.

## Purpose

These prototypes demonstrate workflow UIs that will inform:
1. **Backend API design** - A flexible workflow engine that can handle multiple workflow types
2. **Admin configuration** - UI for admins to configure and customize workflows
3. **Consistent user experience** - Predictable flow structure across all workflows

## Workflow Structure

Each workflow follows this pattern:

### 1. Step-Based Progression
- Linear or conditional step progression
- Clear step indicators (progress bar/stepper)
- Back navigation where appropriate
- State management for workflow data

### 2. Common Elements
- **Breadcrumb navigation** - Shows context within the portal
- **Progress indicator** - Visual representation of current step
- **Step components** - Self-contained step UIs
- **Cancel/exit** - Ability to abandon workflow (steps 1-N)
- **Final action** - Completion or post-completion actions (step N+1)

### 3. State Management
Each workflow maintains:
- Current step
- Workflow-specific state object
- Step transition handlers
- Cancel/reset handlers

### 4. File Organization

```
src/app/components/workflows/
├── WorkflowSelector.tsx          # Workflow registry and switcher
├── CertificatePurchaseWorkflow.tsx
├── UserVerificationWorkflow.tsx
└── [WorkflowName]Workflow.tsx

src/app/components/[workflow-name]/
├── Step1Component.tsx
├── Step2Component.tsx
└── StepNComponent.tsx
```

## Backend Considerations

When implementing these workflows in the production Vue + Vuetify application:

### API Design
- **Workflow engine** should support:
  - Dynamic step definitions
  - Conditional step logic
  - State persistence between steps
  - Resumable workflows
  - Audit trail

### Data Model
```typescript
interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  cancelable: boolean;
  resumable: boolean;
}

interface WorkflowStep {
  id: string;
  component: string;
  validations: ValidationRule[];
  nextStep: string | ConditionalNext;
  canGoBack: boolean;
}

interface WorkflowInstance {
  id: string;
  workflowId: string;
  userId: string;
  currentStep: string;
  state: Record<string, any>;
  status: 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Admin Configuration
Admins should be able to:
- Enable/disable workflows
- Configure step requirements
- Customize validation rules
- Set conditional logic
- Define approval requirements

## Pattern Checklist

When creating a new workflow, ensure:

- [ ] Workflow registered in `WorkflowSelector.tsx`
- [ ] Main workflow component in `workflows/` directory
- [ ] Step components in dedicated subdirectory
- [ ] State interface defined
- [ ] Progress indicator implemented
- [ ] Breadcrumb navigation included
- [ ] Cancel/exit functionality (where appropriate)
- [ ] Back navigation (where appropriate)
- [ ] Final step completion action
- [ ] Consistent styling with Aretiico design system
- [ ] Follows Titillium Web typography
- [ ] Uses semantic color tokens

## Current Workflows

1. **Certificate Purchase** (`certificate-purchase`)
   - Domain input + organization selection
   - Verification method selection
   - Domain verification (per-domain for multi-domain certs)
   - Organization details (DV vs OV)
   - Certificate download + revocation

2. **User Verification** (`user-verification`)
   - [To be implemented]

## Notes for Implementation

- These are **prototypes** in React for rapid iteration
- Production implementation should be in **Vue 3 + Vuetify**
- Use Aretiico design system tokens from markdown files
- Maintain workflow pattern consistency for backend abstraction
- Each workflow is self-contained but follows the same structure
