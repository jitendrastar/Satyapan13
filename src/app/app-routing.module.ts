import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "selectrole",
    loadChildren: () =>
      import("./selectrole/selectrole.module").then(
        (m) => m.SelectrolePageModule
      ),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardPageModule),
  },
  {
    path: "post-verification-pending-list",
    loadChildren: () =>
      import(
        "./post-verification-pending-list/post-verification-pending-list.module"
      ).then((m) => m.PostVerificationPendingListPageModule),
  },
  {
    path: "pv-complete",
    loadChildren: () =>
      import("./pv-complete/pv-complete.module").then(
        (m) => m.PvCompletePageModule
      ),
  },
  {
    path: "pre-verification",
    loadChildren: () =>
      import("./pre-verification/pre-verification.module").then(
        (m) => m.PreVerificationPageModule
      ),
  },
  {
    path: "work-confirmation-list",
    loadChildren: () =>
      import("./work-confirmation-list/work-confirmation-list.module").then(
        (m) => m.WorkConfirmationListPageModule
      ),
  },
  {
    path: "subsidy-detail",
    loadChildren: () =>
      import("./subsidy-detail/subsidy-detail.module").then(
        (m) => m.SubsidyDetailPageModule
      ),
  },
  {
    path: "post-subsidy-detail",
    loadChildren: () =>
      import("./post-subsidy-detail/post-subsidy-detail.module").then(
        (m) => m.PostSubsidyDetailPageModule
      ),
  },
  {
    path: "aao-verification",
    loadChildren: () =>
      import("./aao-verification/aao-verification.module").then(
        (m) => m.AaoVerificationPageModule
      ),
  },
  {
    path: "verification-done-by",
    loadChildren: () =>
      import("./verification-done-by/verification-done-by.module").then(
        (m) => m.VerificationDoneByPageModule
      ),
  },
  {
    path: "work-confirmation",
    loadChildren: () =>
      import("./work-confirmation/work-confirmation.module").then(
        (m) => m.WorkConfirmationPageModule
      ),
  },
  {
    path: "pv-details",
    loadChildren: () =>
      import("./pv-details/pv-details.module").then(
        (m) => m.PvDetailsPageModule
      ),
  },
  {
    path: "post-action-detail",
    loadChildren: () =>
      import("./post-action-detail/post-action-detail.module").then(
        (m) => m.PostActionDetailPageModule
      ),
  },
  {
    path: "pre-action-detail",
    loadChildren: () =>
      import("./pre-action-detail/pre-action-detail.module").then(
        (m) => m.PreActionDetailPageModule
      ),
  },
  {
    path: "forward-to",
    loadChildren: () =>
      import("./forward-to/forward-to.module").then(
        (m) => m.ForwardToPageModule
      ),
  },
  {
    path: "assign-submission",
    loadChildren: () =>
      import("./assign-submission/assign-submission.module").then(
        (m) => m.AssignSubmissionPageModule
      ),
  },
  {
    path: "post-verification-show-details-confirmation",
    loadChildren: () =>
      import(
        "./post-verification-show-details-confirmation/post-verification-show-details-confirmation.module"
      ).then((m) => m.PostVerificationShowDetailsConfirmationPageModule),
  },
  {
    path: "version-update",
    loadChildren: () =>
      import("./version-update/version-update.module").then(
        (m) => m.VersionUpdatePageModule
      ),
  },
  {
    path: "offline-mode",
    loadChildren: () =>
      import("./offline-mode/offline-mode.module").then(
        (m) => m.OfflineModePageModule
      ),
  },
  {
    path: "sync-data",
    loadChildren: () =>
      import("./sync-data/sync-data.module").then((m) => m.SyncDataPageModule),
  },
  {
    path: "sync-farm-pond",
    loadChildren: () =>
      import("./sync-farm-pond/sync-farm-pond.module").then(
        (m) => m.SyncFarmPondPageModule
      ),
  },
  {
    path: "bill-model",
    loadChildren: () =>
      import("./bill-model/bill-model.module").then(
        (m) => m.BillModelPageModule
      ),
  },
  {
    path: "pipeline-post-verification",
    loadChildren: () =>
      import(
        "./pipeline-post-verification/pipeline-post-verification.module"
      ).then((m) => m.PipelinePostVerificationPageModule),
  },
  {
    path: "pipeline-bill-model-post-verifiaction",
    loadChildren: () =>
      import(
        "./pipeline-bill-model-post-verifiaction/pipeline-bill-model-post-verifiaction.module"
      ).then((m) => m.PipelineBillModelPostVerifiactionPageModule),
  },
  {
    path: "postverification-report",
    loadChildren: () =>
      import("./postverification-report/postverification-report.module").then(
        (m) => m.PostverificationReportPageModule
      ),
  },
  {
    path: "diggi-post-verification",
    loadChildren: () =>
      import("./diggi-post-verification/diggi-post-verification.module").then(
        (m) => m.DiggiPostVerificationPageModule
      ),
  },
  {
    path: "water-tank-post-verification",
    loadChildren: () =>
      import(
        "./water-tank-post-verification/water-tank-post-verification.module"
      ).then((m) => m.WaterTankPostVerificationPageModule),
  },
  {
    path: "farm-pond-pre-verification",
    loadChildren: () =>
      import(
        "./farm-pond-pre-verification/farm-pond-pre-verification.module"
      ).then((m) => m.FarmPondPreVerificationPageModule),
  },
  {
    path: "pipeline-pre-verification",
    loadChildren: () =>
      import(
        "./pipeline-pre-verification/pipeline-pre-verification.module"
      ).then((m) => m.PipelinePreVerificationPageModule),
  },
  {
    path: "diggi-pre-verification",
    loadChildren: () =>
      import("./diggi-pre-verification/diggi-pre-verification.module").then(
        (m) => m.DiggiPreVerificationPageModule
      ),
  },
  {
    path: "preverification-water-tank",
    loadChildren: () =>
      import(
        "./preverification-water-tank/preverification-water-tank.module"
      ).then((m) => m.PreverificationWaterTankPageModule),
  },
  {
    path: "farm-impliment-pre-verification",
    loadChildren: () =>
      import(
        "./farm-impliment-pre-verification/farm-impliment-pre-verification.module"
      ).then((m) => m.FarmImplimentPreVerificationPageModule),
  },
  {
    path: "manufacture-dashboard",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/manufacture-dashboard/manufacture-dashboard.module"
      ).then((m) => m.ManufactureDashboardPageModule),
  },
  {
    path: "subsidy-dashboard",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/subsidy-dashboard/subsidy-dashboard.module"
      ).then((m) => m.SubsidyDashboardPageModule),
  },

  {
    path: "dealer-assign-submission",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/dealer-assign-submission/dealer-assign-submission.module"
      ).then((m) => m.DealerAssignSubmissionPageModule),
  },
  {
    path: "assign-to-dealer-application-list",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/assign-to-dealer-application-list/assign-to-dealer-application-list.module"
      ).then((m) => m.AssignToDealerApplicationListPageModule),
  },
  {
    path: "dealer-application-details",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/dealer-application-details/dealer-application-details.module"
      ).then((m) => m.DealerApplicationDetailsPageModule),
  },

  {
    path: "farm-implements-post-verification",
    loadChildren: () =>
      import(
        "./farm-implements-post-verification/farm-implements-post-verification.module"
      ).then((m) => m.FarmImplementsPostVerificationPageModule),
  },
  {
    path: "bill-model-farm-implement",
    loadChildren: () =>
      import(
        "./bill-model-farm-implement/bill-model-farm-implement.module"
      ).then((m) => m.BillModelFarmImplementPageModule),
  },
  {
    path: "lic-dashboard",
    loadChildren: () =>
      import("./licenseFolder/lic-dashboard/lic-dashboard.module").then(
        (m) => m.LicDashboardPageModule
      ),
  },
  {
    path: "lic-subsidy-dashboard",
    loadChildren: () =>
      import(
        "./licenseFolder/lic-subsidy-dashboard/lic-subsidy-dashboard.module"
      ).then((m) => m.LicSubsidyDashboardPageModule),
  },
  {
    path: "lic-application-list",
    loadChildren: () =>
      import(
        "./licenseFolder/lic-application-list/lic-application-list.module"
      ).then((m) => m.LicApplicationListPageModule),
  },
  {
    path: "subsidy-lic-selection",
    loadChildren: () =>
      import(
        "./licenseFolder/subsidy-lic-selection/subsidy-lic-selection.module"
      ).then((m) => m.SubsidyLicSelectionPageModule),
  },
  {
    path: "lic-list",
    loadChildren: () =>
      import("./licenseFolder/lic-list/lic-list.module").then(
        (m) => m.LicListPageModule
      ),
  },
  {
    path: "lic-sub-list",
    loadChildren: () =>
      import("./licenseFolder/lic-sub-list/lic-sub-list.module").then(
        (m) => m.LicSubListPageModule
      ),
  },
  {
    path: "applicant-list",
    loadChildren: () =>
      import("./licenseFolder/applicant-list/applicant-list.module").then(
        (m) => m.ApplicantListPageModule
      ),
  },
  {
    path: "application-verification",
    loadChildren: () =>
      import(
        "./licenseFolder/application-verification/application-verification.module"
      ).then((m) => m.ApplicationVerificationPageModule),
  },
  {
    path: "upload-images",
    loadChildren: () =>
      import("./licenseFolder/upload-images/upload-images.module").then(
        (m) => m.UploadImagesPageModule
      ),
  },
  {
    path: "horticulture-application-list",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/horticulture-application-list/horticulture-application-list.module"
      ).then((m) => m.HorticultureApplicationListPageModule),
  },
  {
    path: "horticulture-application-details",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/horticulture-application-details/horticulture-application-details.module"
      ).then((m) => m.HorticultureApplicationDetailsPageModule),
  },
  {
    path: "horti-application-bill-model",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/horti-application-bill-model/horti-application-bill-model.module"
      ).then((m) => m.HortiApplicationBillModelPageModule),
  },
  {
    path: "drip-post-verification",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/drip-post-verification/drip-post-verification.module"
      ).then((m) => m.DripPostVerificationPageModule),
  },
  {
    path: "mini-sprinkler-post-verification",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/mini-sprinkler-post-verification/mini-sprinkler-post-verification.module"
      ).then((m) => m.MiniSprinklerPostVerificationPageModule),
  },
  {
    path: "micro-sprinkler-post-verification",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/micro-sprinkler-post-verification/micro-sprinkler-post-verification.module"
      ).then((m) => m.MicroSprinklerPostVerificationPageModule),
  },
  {
    path: "raingun-post-verification",
    loadChildren: () =>
      import(
        "./ManufacturerDealerFolder/raingun-post-verification/raingun-post-verification.module"
      ).then((m) => m.RaingunPostVerificationPageModule),
  },
  {
    path: "material-verification-list",
    loadChildren: () =>
      import(
        "./material-verification-list/material-verification-list.module"
      ).then((m) => m.MaterialVerificationListPageModule),
  },
  {
    path: "material-verification",
    loadChildren: () =>
      import("./material-verification/material-verification.module").then(
        (m) => m.MaterialVerificationPageModule
      ),
  },
  {
    path: "material-completed-list",
    loadChildren: () =>
      import("./material-completed-list/material-completed-list.module").then(
        (m) => m.MaterialCompletedListPageModule
      ),
  },
  {
    path: "material-completed-details",
    loadChildren: () =>
      import(
        "./material-completed-details/material-completed-details.module"
      ).then((m) => m.MaterialCompletedDetailsPageModule),
  },
  {
    path: "material-pending-gathered",
    loadChildren: () =>
      import(
        "./material-pending-gathered/material-pending-gathered.module"
      ).then((m) => m.MaterialPendingGatheredPageModule),
  },
  {
    path: "material-pending-gathered-details",
    loadChildren: () =>
      import(
        "./material-pending-gathered-details/material-pending-gathered-details.module"
      ).then((m) => m.MaterialPendingGatheredDetailsPageModule),
  },
  {
    path: 'ksk-update',
    loadChildren: () => import('./ksk-update/ksk-update.module').then( m => m.KskUpdatePageModule)
  },
  {
    path: 'assignmodal',
    loadChildren: () => import('./licenseFolder/assignmodal/assignmodal.module').then( m => m.AssignmodalPageModule)
  },
  {
    path: 'applicant-list-completed',
    loadChildren: () => import('./licenseFolder/applicant-list-completed/applicant-list-completed.module').then( m => m.ApplicantListCompletedPageModule)
  },
  {
    path: 'application-verification-completed',
    loadChildren: () => import('./licenseFolder/application-verification-completed/application-verification-completed.module').then( m => m.ApplicationVerificationCompletedPageModule)
  },
  {
    path: 'assigned-list',
    loadChildren: () => import('./licenseFolder/assigned-list/assigned-list.module').then( m => m.AssignedListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
