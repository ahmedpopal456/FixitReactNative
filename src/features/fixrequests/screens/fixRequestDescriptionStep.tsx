import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  H2, P, Spacer,
} from 'fixit-common-ui';
import {
  connect,
  fixRequestActions,
  FixRequestService,
  store,
  StoreState,
  FixTemplateObjectModel,
  FixRequestModel,
  SectionModel,
  SectionDetailsModel,
  TagModel,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormNextPageArrows, FormTextInput } from '../../../components/forms';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import { StepIndicator } from '../../../components/index';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import FixRequestHeader from '../components/fixRequestHeader';

type FixRequestDescriptionStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestDescriptionStep'
>;

export type FixRequestDescriptionStepProps = {
  navigation: FixRequestDescriptionStepNavigationProps;
  fixTemplateId: string,
  fixRequestObj: FixRequestModel,
  fixStepsDynamicRoutes:{
    key:string,
  }[],
  numberOfSteps: number,
};

// eslint-disable-next-line max-len
const fixRequestDescriptionStep: FunctionComponent<FixRequestDescriptionStepProps> = (props: FixRequestDescriptionStepProps): JSX.Element => {
  const [description, setDescription] = useState<string>(props.fixRequestObj.details.description);

  const setTags = (): Array<TagModel> => {
    const tags : Array<TagModel> = new Array<TagModel>();
    props.fixRequestObj.tags.forEach((tag: { id?: string, name: string, }) : void => {
      tags.push(tag);
    });
    return tags;
  };

  // TODO: this needs to be reworked. The FixTemplateObjectModel's section has a different type
  const setSections = (): Array<SectionModel> => {
    const sections: Array<SectionModel> = new Array<SectionModel>();
    props.fixRequestObj.details.sections.forEach((section: SectionModel) : void => {
      const fields : Array<SectionDetailsModel> = [];
      section.details.forEach((sectionDetails: SectionDetailsModel) : void => {
        fields.push({ name: sectionDetails.name, value: sectionDetails.value });
      });
      sections.push({ name: section.name, details: fields });
    });
    return sections;
  };

  const handleContinue = () : void => {
    const fixRequestService = new FixRequestService(store);

    const tags = setTags();
    const sections = setSections();

    const fixTemplateObject : FixTemplateObjectModel = {
      Status: 'Public',
      Name: props.fixRequestObj.details.name,
      WorkTypeId: props.fixRequestObj.details.type,
      WorkCategoryId: props.fixRequestObj.details.category,
      FixUnitId: props.fixRequestObj.details.unit,
      Description: description,
      CreatedByUserId: store.getState().user.userId,
      UpdatedByUserId: store.getState().user.userId,
      Tags: tags,
      // TODO: remove as any
      Sections: sections as any,
    };

    if (props.fixTemplateId) {
      fixRequestService.updateFixTemplate(fixTemplateObject, props.fixTemplateId);
    } else {
      fixRequestService.saveFixTemplate(fixTemplateObject);
    }
    props.navigation.navigate('FixRequestImagesLocationStep');
  };

  const handleAddSection = () : void => {
    store.dispatch(fixRequestActions.setNumberOfSteps(
      { numberOfSteps: props.numberOfSteps + 1 },
    ));
    props.navigation.navigate('FixRequestSectionsStep');
  };

  const generateNextPageOptions = () : {label:string, onClick: () => void}[] => {
    const nextPageOptionsObj = [{
      label: (props.fixTemplateId) ? 'Update Fixit Template & Continue' : 'Save Fixit Template & Continue',
      onClick: handleContinue,
    }];
    if (props.fixTemplateId
      && props.fixRequestObj.details.sections.length > 0
      && !props.fixStepsDynamicRoutes[0]) {
      return [
        ...nextPageOptionsObj,
        {
          label: 'Go to first fix section',
          onClick: () => {
            props.navigation.navigate('FixRequestSectionsStep');
          },
        },
      ];
    } if (props.fixStepsDynamicRoutes[0]) {
      return [
        ...nextPageOptionsObj,
        {
          label: 'Go to first fix section',
          onClick: () => {
            props.navigation.navigate({
              name: 'FixRequestSectionsStep',
              key: props.fixStepsDynamicRoutes[0].key,
            });
          },
        },
      ];
    } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: handleAddSection }];
  };

  const render = () : JSX.Element => (
    <>
      <FixRequestHeader
        showBackBtn={true} navigation={props.navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}/>
      <StyledPageWrapper>
        <StepIndicator
          numberSteps={props.numberOfSteps}
          currentStep={2} />
        <StyledScrollView>
          <StyledContentWrapper>
            <P>This section will be part of your new Fixit Template.
                You can fill the the fields with your requirement.</P>
            <Spacer height="20px" />
            <H2 style={{ fontWeight: 'bold' }}>Fix Description</H2>
            <Spacer height="5px" />
            <FormTextInput big
              onChange={
                (text : string) => setDescription(text)
              }
              value={description} />
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows secondaryClickOptions={generateNextPageOptions()} />
    </>
  );
  return render();
};

function mapStateToProps(state : StoreState) {
  return {
    fixTemplateId: state.fixRequest.fixTemplateId,
    fixRequestObj: state.fixRequest.fixRequestObj,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
    numberOfSteps: state.fixRequest.numberOfSteps,
  };
}

export default connect(mapStateToProps)(fixRequestDescriptionStep);
