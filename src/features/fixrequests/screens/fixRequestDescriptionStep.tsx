import React, { FunctionComponent, useState, useEffect } from 'react';
import { P, Spacer } from 'fixit-common-ui';
import { store, StoreState, useSelector, fixTemplateActions } from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import { FormNextPageArrows } from '../../../components/forms';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import { StepIndicator } from '../../../components/index';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import FixRequestHeader from '../components/fixRequestHeader';
import { FixTemplateFormTextInput } from '../components';
import constants from './constants';
import { ScrollView } from 'react-native';

const FixRequestDescriptionStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const [description, setDescription] = useState<string>(fixTemplate.description);

  useEffect(() => {
    setDescription(fixTemplate.description);
  }, [fixTemplate.description]);

  const handleContinue = (): void => {
    store.dispatch(
      fixTemplateActions.updateFixTemplate({
        description,
      }),
    );

    navigation.navigate('FixRequestImagesLocationStep');
  };

  const nextPageOptions = [
    {
      label: 'Save Fixit Template & Continue',
      onClick: handleContinue,
    },
    {
      label: 'Go to first fix section',
      onClick: () => {
        store.dispatch(fixTemplateActions.updateFixTemplate({ description }));
        navigation.navigate('FixRequestSectionsStep');
      },
    },
  ];

  const render = (): JSX.Element => (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={constants.NUMBER_OF_STEPS} currentStep={2} />
        <ScrollView>
          <StyledContentWrapper>
            <P>This section will be part of your new Fixit Template. You can fill the fields with your requirement.</P>
            <Spacer height="20px" />
            <FixTemplateFormTextInput
              header={'Fix Description'}
              big={true}
              top={true}
              onChange={(text: string) => setDescription(text)}
              value={description}
            />
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows secondaryClickOptions={nextPageOptions} />
    </>
  );
  return render();
};

export default FixRequestDescriptionStep;
