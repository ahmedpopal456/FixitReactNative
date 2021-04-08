import React from 'react';
import {
  H2, P, Spacer,
} from 'fixit-common-ui';
import {
  connect, fixRequestActions, rootContext, store, StoreState,
} from 'fixit-common-data-store';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import StepIndicator from '../../components/stepIndicator';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import FormTextInput from '../../components/formTextInput';
import FormNextPageArrows from '../../components/formNextPageArrows';
import { FixRequestDescriptionStepProps } from '../../models/screens/fixRequests/fixRequestDescriptionStepModel';

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
      this.props.navigation.navigate('FixRequestImagesLocationStep');
    }

    handleAddSection = () : void => {
      store.dispatch(fixRequestActions.setNumberOfSteps(
        store.getState().fixRequest.numberOfSteps + 1,
      ));
      this.props.navigation.navigate('FixRequestSectionsStep');
    }

    generateNextPageOptions = () : {label:string, onClick: () => void}[] => {
      const nextPageOptionsObj = [{
        label: 'Save Fixit Template & Continue',
        onClick: this.handleContinue,
      }];

      if (store.getState().fixRequest.fixStepsDynamicRoutes[0]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to first fix section',
            onClick: () => {
              this.props.navigation.navigate({
                name: 'FixRequestSectionsStep',
                key: store.getState().fixRequest.fixStepsDynamicRoutes[0].key,
              });
            },
          },
        ];
      } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: this.handleAddSection }];
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader showBackBtn={true} navigation={this.props.navigation} screenTitle="Create a Fixit Template and your Fixit Request" textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={store.getState().fixRequest.numberOfSteps}
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
                  value={this.props.fixDescription} />
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>

          <FormNextPageArrows secondaryClickOptions={this.generateNextPageOptions()} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return { fixDescription: state.fixRequest.fixRequestObj.Details[0].Description };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestDescriptionStep);