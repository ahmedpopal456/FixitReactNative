import React from 'react';
import {
  H2, P, Spacer,
} from 'fixit-common-ui';
import {
  connect,
  fixRequestActions,
  FixRequestService,
  persistentStore,
  rootContext,
  store,
  StoreState,
  FixTemplateObjectModel,
  FixRequestObjModel,
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
  fixRequestObj: FixRequestObjModel,
  fixStepsDynamicRoutes:{
    key:string,
  }[],
  numberOfSteps: number,
};

class FixRequestDescriptionStep extends
  React.Component<FixRequestDescriptionStepProps> {
    unsubscribe: (() => void) | undefined;

    componentDidMount = () : void => {
      this.unsubscribe = this.props.navigation.addListener(
        'focus',
        () => {
          this.forceUpdate();
        },
      );
    }

    componentWillUnmount = () : void => {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    handleContinue = () : void => {
      const serv = new FixRequestService(store);

      const tags : string[] = [];
      this.props.fixRequestObj.Tags.forEach((tag: { Id?: string, Name: string, }) : void => {
        tags.push(tag.Name);
      });

      const sections: {
          Name:string,
          Fields:{
              Name:string,
              Values:string[],
          }[]
      }[] = [];
      this.props.fixRequestObj.Details[0].Sections.forEach((section:{
        Name:string,
        Details:{
            Name:string,
            Value:string,
        }[] }) : void => {
        const fields : {
            Name:string,
            Values:string[],
          }[] = [];
        section.Details.forEach((field: {Name:string, Value:string}) : void => {
          fields.push({ Name: field.Name, Values: [field.Value] });
        });
        sections.push({ Name: section.Name, Fields: fields });
      });

      const fixTemplateObject : FixTemplateObjectModel = {
        Status: 'Public',
        Name: this.props.fixRequestObj.Details[0].Name,
        WorkTypeId: this.props.fixRequestObj.Details[0].Type,
        WorkCategoryId: this.props.fixRequestObj.Details[0].Category,
        FixUnitId: this.props.fixRequestObj.Details[0].Unit,
        Description: this.props.fixRequestObj.Details[0].Description,
        CreatedByUserId: persistentStore.getState().user.userId,
        UpdatedByUserId: persistentStore.getState().user.userId,
        Tags: tags,
        Sections: sections,
      };

      if (this.props.fixTemplateId) {
        serv.updateFixTemplate(fixTemplateObject, this.props.fixTemplateId);
      } else {
        serv.saveFixTemplate(fixTemplateObject);
      }
      this.props.navigation.navigate('FixRequestImagesLocationStep');
    }

    handleAddSection = () : void => {
      store.dispatch(fixRequestActions.setNumberOfSteps(
        this.props.numberOfSteps + 1,
      ));
      this.props.navigation.navigate('FixRequestSectionsStep');
    }

    generateNextPageOptions = () : {label:string, onClick: () => void}[] => {
      const nextPageOptionsObj = [{
        label: (this.props.fixTemplateId) ? 'Update Fixit Template & Continue' : 'Save Fixit Template & Continue',
        onClick: this.handleContinue,
      }];
      if (this.props.fixTemplateId
      && this.props.fixRequestObj.Details[0].Sections.length > 0
      && !this.props.fixStepsDynamicRoutes[0]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to first fix section',
            onClick: () => {
              this.props.navigation.navigate('FixRequestSectionsStep');
            },
          },
        ];
      } if (this.props.fixStepsDynamicRoutes[0]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to first fix section',
            onClick: () => {
              this.props.navigation.navigate({
                name: 'FixRequestSectionsStep',
                key: this.props.fixStepsDynamicRoutes[0].key,
              });
            },
          },
        ];
      } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: this.handleAddSection }];
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader
            showBackBtn={true} navigation={this.props.navigation}
            screenTitle="Create a Fixit Template and your Fixit Request"
            textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={this.props.numberOfSteps}
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
                    (text : string) => store.dispatch(fixRequestActions.setFixDescription(text))
                  }
                  value={this.props.fixRequestObj.Details[0].Description} />
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>

          <FormNextPageArrows secondaryClickOptions={this.generateNextPageOptions()} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    fixTemplateId: state.fixRequest.fixTemplateId,
    fixRequestObj: state.fixRequest.fixRequestObj,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
    numberOfSteps: state.fixRequest.numberOfSteps,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestDescriptionStep);
