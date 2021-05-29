import { FixesModel } from 'fixit-common-data-store';

export type HomeStackNavigatorProps = {
    HomeScreen: undefined;
    SearchResultsScreen: {
      tags?: string[]
    };
    FixRequestMetaStep: undefined;
    FixRequestDescriptionStep: undefined;
    FixRequestSectionsStep: undefined;
    FixRequestImagesLocationStep: undefined;
    FixRequestScheduleStep: undefined;
    FixRequestReview: {
      passedFix: FixesModel,
      isFixCraftsmanResponseNotification: boolean,
    };
    FixSuggestChanges: { passedFix: FixesModel};
    FixSuggestChangesReview: { passedFix: FixesModel, cost:string, comments:string};
  };
