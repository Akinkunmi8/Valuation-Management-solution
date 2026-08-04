
```
frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ config
│  │  │  └─ development.ts
│  │  ├─ layouts
│  │  │  ├─ AuthLayout.tsx
│  │  │  └─ MainLayout.tsx
│  │  ├─ providers
│  │  ├─ router
│  │  │  └─ AppRouter.tsx
│  │  └─ store
│  │     ├─ hooks.ts
│  │     └─ store.ts
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ login_bg2.png
│  │  ├─ vite.svg
│  │  └─ welcome.png
│  ├─ features
│  │  ├─ approvals
│  │  │  ├─ api
│  │  │  └─ types
│  │  │     └─ cmActionTypes.ts
│  │  ├─ audit
│  │  ├─ auth
│  │  │  ├─ api
│  │  │  │  └─ authApi.ts
│  │  │  ├─ pages
│  │  │  │  ├─ LoginPage.tsx
│  │  │  │  ├─ RegisterPage.tsx
│  │  │  │  ├─ VerificationPage.tsx
│  │  │  │  └─ WelcomePage.tsx
│  │  │  ├─ schemas
│  │  │  │  └─ authSchemas.ts
│  │  │  ├─ services
│  │  │  │  └─ authService.ts
│  │  │  ├─ store
│  │  │  │  └─ authSlice.ts
│  │  │  ├─ types
│  │  │  │  └─ authTypes.ts
│  │  │  └─ utils
│  │  │     ├─ authStorage.ts
│  │  │     └─ createdBy.ts
│  │  ├─ collateral
│  │  ├─ dashboard
│  │  │  ├─ api
│  │  │  │  ├─ cmDashboardApi.ts
│  │  │  │  ├─ cmsDashboardApi.ts
│  │  │  │  └─ rmDashboardApi.ts
│  │  │  ├─ components
│  │  │  │  └─ MetricCard.tsx
│  │  │  ├─ pages
│  │  │  │  ├─ AdminDashboardPage.tsx
│  │  │  │  ├─ AuditDashboardPage.tsx
│  │  │  │  ├─ BmDashboardPage.tsx
│  │  │  │  ├─ CmDashboardPage.tsx
│  │  │  │  ├─ CmsDashboardPage.tsx
│  │  │  │  └─ RmDashboardPage.tsx
│  │  │  └─ types
│  │  │     ├─ cmDashboardTypes.ts
│  │  │     └─ cmsDashboardTypes.ts
│  │  ├─ facilities
│  │  │  ├─ api
│  │  │  │  └─ facilityApi.ts
│  │  │  ├─ components
│  │  │  │  ├─ CollateralCard.tsx
│  │  │  │  ├─ CustomerInformationCard.tsx
│  │  │  │  ├─ DocumentCard.tsx
│  │  │  │  ├─ FacilityDetailsCard.tsx
│  │  │  │  ├─ FacilityFilters.tsx
│  │  │  │  ├─ FacilityMetrics.tsx
│  │  │  │  └─ FacilityTable.tsx
│  │  │  ├─ constants
│  │  │  │  ├─ cmColumns.tsx
│  │  │  │  ├─ cmsColumns.tsx
│  │  │  │  ├─ facilityColumns.tsx
│  │  │  │  ├─ facilityConstants.tsx
│  │  │  │  ├─ facilityOptions.ts
│  │  │  │  ├─ facilityStepFields.ts
│  │  │  │  ├─ facilitySteps.ts
│  │  │  │  └─ locationOptions.ts
│  │  │  ├─ data
│  │  │  ├─ hooks
│  │  │  ├─ pages
│  │  │  │  ├─ CreateFacilityPage.tsx
│  │  │  │  ├─ FacilitiesPage.tsx
│  │  │  │  └─ FacilityDetailsPage.tsx
│  │  │  ├─ schemas
│  │  │  │  └─ facilitySchemas.ts
│  │  │  ├─ services
│  │  │  │  ├─ facilityService.ts
│  │  │  │  ├─ mockCustomerService.ts
│  │  │  │  └─ mockValuers.ts
│  │  │  ├─ types
│  │  │  │  └─ facilityTypes.tsx
│  │  │  ├─ utils
│  │  │  │  ├─ formData.ts
│  │  │  │  ├─ status.ts
│  │  │  │  └─ valuationFee.ts
│  │  │  └─ workspace
│  │  │     ├─ CollateralTab.tsx
│  │  │     ├─ CustomerTab.tsx
│  │  │     ├─ DetailItem.tsx
│  │  │     ├─ DocumentsTab.tsx
│  │  │     ├─ OverviewTab.tsx
│  │  │     └─ WorkspaceTab.tsx
│  │  ├─ payments
│  │  │  ├─ api
│  │  │  │  ├─ cmValuersPaymentApi.ts
│  │  │  │  ├─ getFacilityPaymentApi.ts
│  │  │  │  └─ paymentApi.ts
│  │  │  ├─ components
│  │  │  │  └─ PaymentTab.tsx
│  │  │  ├─ Page
│  │  │  │  ├─ CmValuersPaymentPage.tsx
│  │  │  │  ├─ PaymentsPage.tsx
│  │  │  │  └─ PayValuersPage.tsx
│  │  │  └─ types
│  │  │     └─ paymentTypes.ts
│  │  ├─ reports
│  │  │  ├─ api
│  │  │  │  └─ reportApi.ts
│  │  │  ├─ components
│  │  │  │  ├─ ComparableSalesCard.tsx
│  │  │  │  ├─ PropertyInformationCard.tsx
│  │  │  │  ├─ reportState
│  │  │  │  │  ├─ ApprovedReportCard.tsx
│  │  │  │  │  ├─ CreateReportPrompt.tsx
│  │  │  │  │  ├─ EmptyReportState.tsx
│  │  │  │  │  ├─ RejectedReportCard.tsx
│  │  │  │  │  └─ ReviewingReportCard.tsx
│  │  │  │  ├─ UploadReportCard.tsx
│  │  │  │  └─ ValuationInformationCard.tsx
│  │  │  ├─ constants
│  │  │  │  ├─ reportColumns.tsx
│  │  │  │  ├─ reportStepFields.ts
│  │  │  │  └─ reportSteps.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ mapFacilityToReportForm.ts
│  │  │  │  └─ mapReportDetailsToReportForm.ts
│  │  │  ├─ pages
│  │  │  │  ├─ SubmitValuationReportPage.tsx
│  │  │  │  └─ ValuerReportDashboardPage.tsx
│  │  │  ├─ schemas
│  │  │  │  └─ reportSchemas.ts
│  │  │  ├─ types
│  │  │  │  └─ reportDashboardTypes.ts
│  │  │  └─ utils
│  │  │     ├─ createReportFormData.ts
│  │  │     └─ getReportView.ts
│  │  ├─ settings
│  │  ├─ users
│  │  ├─ valuations
│  │  │  ├─ api
│  │  │  │  └─ valuationReportApi.ts
│  │  │  ├─ components
│  │  │  │  ├─ DocumentTab.tsx
│  │  │  │  ├─ OverviewTab.tsx
│  │  │  │  ├─ PropertyTab.tsx
│  │  │  │  ├─ ValuationTab.tsx
│  │  │  │  └─ WorkflowTab.tsx
│  │  │  ├─ constants
│  │  │  │  ├─ valuationReportColumns.tsx
│  │  │  │  └─ valuationReportTabs.ts
│  │  │  ├─ pages
│  │  │  │  ├─ ValuationReportDetailsPage.tsx
│  │  │  │  └─ ValuationReportsPage.tsx
│  │  │  ├─ types
│  │  │  │  └─ valuationReportTypes.ts
│  │  │  └─ utilis
│  │  │     └─ status.ts
│  │  └─ workflow
│  │     ├─ api
│  │     │  ├─ cmActionApi.ts
│  │     │  └─ cmsActionApi.ts
│  │     └─ components
│  │        ├─ AssignmentTab.tsx
│  │        └─ WorkflowTab.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ prestyle.css
│  ├─ shared
│  │  ├─ api
│  │  │  └─ baseApi.ts
│  │  ├─ auth
│  │  │  ├─ getDashboardRoute.ts
│  │  │  ├─ permission.ts
│  │  │  ├─ PermissionGate.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  └─ RoleGuard.tsx
│  │  ├─ constants
│  │  │  ├─ navigation.ts
│  │  │  ├─ notifyTitles.ts
│  │  │  ├─ pageTitles.ts
│  │  │  ├─ roles.ts
│  │  │  ├─ routes.ts
│  │  │  ├─ statusColors.ts
│  │  │  ├─ statusConfig.ts
│  │  │  └─ workflowStatus.ts
│  │  ├─ file-upload
│  │  │  ├─ documentTypes.ts
│  │  │  ├─ FileUpload.tsx
│  │  │  ├─ index.ts
│  │  │  └─ types.ts
│  │  ├─ hooks
│  │  │  └─ useMetricFilter.ts
│  │  ├─ lib
│  │  │  └─ toast.ts
│  │  ├─ pages
│  │  │  └─ UnauthorizedPage.tsx
│  │  ├─ schemas
│  │  ├─ types
│  │  ├─ ui
│  │  │  ├─ badge
│  │  │  │  └─ Badge.tsx
│  │  │  ├─ button
│  │  │  │  └─ Button.tsx
│  │  │  ├─ card
│  │  │  │  └─ Card.tsx
│  │  │  ├─ input
│  │  │  │  └─ Input.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ Sidebar.tsx
│  │  │  │  └─ Topbar.tsx
│  │  │  ├─ loader
│  │  │  │  ├─ AppLoader.tsx
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ loader.css
│  │  │  │  └─ Skeleton.tsx
│  │  │  ├─ metric-card
│  │  │  │  └─ MetricCard.tsx
│  │  │  ├─ modal
│  │  │  │  └─ CommentModal.tsx
│  │  │  ├─ navigation
│  │  │  │  └─ Breadcrumbs.tsx
│  │  │  ├─ page-header
│  │  │  │  └─ pageHeader.tsx
│  │  │  ├─ select
│  │  │  │  └─ Select.tsx
│  │  │  ├─ spinner
│  │  │  │  └─ Spinner.tsx
│  │  │  ├─ stepper
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ Stepper.tsx
│  │  │  │  ├─ StepperNavigation.tsx
│  │  │  │  └─ types.ts
│  │  │  └─ table
│  │  │     ├─ DataTable.tsx
│  │  │     └─ types.ts
│  │  └─ utils
│  │     ├─ formatCurrency.ts
│  │     ├─ formatDate.ts
│  │     ├─ getHomeRoute.ts
│  │     ├─ getPageMeta.ts
│  │     ├─ getPageTitle.ts
│  │     ├─ mergeUniqueByKeys.ts
│  │     └─ sanitize.ts
│  └─ valuer
│     ├─ api
│     │  ├─ valuerApi.ts
│     │  └─ valuerDashboardApi.ts
│     ├─ components
│     │  └─ ValuersReportTab.tsx
│     ├─ constants
│     │  ├─ valuerColumns.tsx
│     │  ├─ ValuerOverviewTab.tsx
│     │  └─ ValuerWorkSpaceTabs.ts
│     ├─ hooks
│     │  └─ useCurrentValuer.ts
│     ├─ pages
│     │  ├─ ValuerFacilityDetailsPage.tsx
│     │  └─ ValuersDashboardPage.tsx
│     └─ types
│        └─ ValuerDashboardTypes.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```