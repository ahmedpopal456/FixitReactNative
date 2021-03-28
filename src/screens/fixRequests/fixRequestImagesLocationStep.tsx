import React from 'react';
import {
  H2, H3, P, Spacer, Divider,
} from 'fixit-common-ui';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  connect, fixRequestActions, store, StoreState, rootContext,
} from 'fixit-common-data-store';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import GlobalStyles from '../../components/styles/fixRequests/globalStyles';
import FixRequestStyles from '../../components/styles/fixRequests/fixRequestStyles';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import StepIndicator from '../../components/stepIndicator';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import FormNextPageArrows from '../../components/formNextPageArrows';
import FormTextInput from '../../components/formTextInput';
import { FixRequestImagesLocationStepProps } from '../../models/screens/fixRequests/fixRequestImagesLocationStepModel';

class FixRequestImagesLocationStep extends
  React.Component<FixRequestImagesLocationStepProps> {
    handleNextStep = () : void => {
      this.props.navigation.navigate('FixRequestScheduleStep');
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader showBackBtn={true} navigation={this.props.navigation} screenTitle="Create a Fixit Template and your Fixit Request" textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={this.props.numberOfSteps}
              currentStep={3 + this.props.fixStepsDynamicRoutes.length} />
            <StyledScrollView>
              <StyledContentWrapper>
                <P>This section is not saved inside a Fixit Template.
                The Information are required to complete your Fixit Request.</P>
                <Spacer height="20px" />
                <View style={GlobalStyles.flexRow}>
                  <H2 style={FixRequestStyles.titleWithAction}>Images</H2>
                  <TouchableOpacity style={FixRequestStyles.titleActionWrapper}>
                    <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
                  </TouchableOpacity>
                </View>
                <Spacer height="40px" />
                <H2 style={{
                  fontWeight: 'bold',
                  marginBottom: -15,
                }}>Location</H2>
                <Divider />
                <H3 style={{ fontWeight: 'normal' }}>Address</H3>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixAddress(text))
                  }
                  value={this.props.fixAddress} />
                <Spacer height="20px" />
                <H3 style={{ fontWeight: 'normal' }}>City</H3>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixCity(text))
                  }
                  value={this.props.fixCity} />
                <Spacer height="20px" />
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                  <View style={{
                    flexGrow: 1,
                    marginRight: 10,
                  }}>
                    <H3 style={{ fontWeight: 'normal' }}>Province</H3>
                    <Spacer height="5px" />
                    <FormTextInput
                      onChange={
                        (text : string) => store.dispatch(fixRequestActions.setFixProvince(text))
                      }
                      value={this.props.fixProvince} />
                  </View>
                  <View style={{
                    flexGrow: 1,
                    marginLeft: 10,
                  }}>
                    <H3 style={{ fontWeight: 'normal' }}>Postal code</H3>
                    <Spacer height="5px" />
                    <FormTextInput
                      onChange={
                        (text : string) => store.dispatch(fixRequestActions.setFixPostalCode(text))
                      }
                      value={this.props.fixPostalCode} />
                  </View>
                </View>
                <Spacer height="20px" />
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>

          <FormNextPageArrows mainClick={this.handleNextStep} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    fixAddress: state.fixRequest.fixRequestObj.Location.Address,
    fixCity: state.fixRequest.fixRequestObj.Location.City,
    fixProvince: state.fixRequest.fixRequestObj.Location.Province,
    fixPostalCode: state.fixRequest.fixRequestObj.Location.PostalCode,
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestImagesLocationStep);
