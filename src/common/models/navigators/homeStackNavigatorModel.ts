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
    FixSuggestChanges: { passedFix: FixesModel};
    FixSuggestChangesReview: { passedFix: FixesModel, cost:string, comments:string};
  };
