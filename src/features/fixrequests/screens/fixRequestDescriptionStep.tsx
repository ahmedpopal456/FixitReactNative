import React, {
  FunctionComponent, useState, useEffect,
} from 'react';
import { P, Spacer } from 'fixit-common-ui';
import {
  FixRequestService,
  store,
  StoreState,
  FixTemplateStatus,
  useSelector,
  fixTemplateActions,
  FixTemplateCreateRequest,
} from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import { FormNextPageArrows } from '../../../components/forms';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import { StepIndicator } from '../../../components/index';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import FixRequestHeader from '../components/fixRequestHeader';
import { FixTemplateFormTextInput } from '../components';
import constants from './constants';

// eslint-disable-next-line max-len
const FixRequestDescriptionStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const userId = useSelector((storeState: StoreState) => storeState.user.userId);
  const [description, setDescription] = useState<string>(fixTemplate.description);

  useEffect(() => {
    setDescription(fixTemplate.description);
  }, [fixTemplate.description]);

  const handleContinue = () : void => {
    const fixRequestService = new FixRequestService(store);
    store.dispatch(fixTemplateActions.updateFixTemplate({
      description,
    }));

    const fixTemplateCreateRequest: FixTemplateCreateRequest = {
      name: fixTemplate.name,
      status: FixTemplateStatus.PRIVATE,
      workTypeId: fixTemplate.workType.id,
      workCategoryId: fixTemplate.workCategory.id,
      fixUnitId: fixTemplate.fixUnit.id,
      description: fixTemplate.description,
      createdByUserId: userId || '',
      updatedByUserId: userId,
      tags: fixTemplate.tags,
      sections: fixTemplate.sections,
    };

    fixRequestService.saveFixTemplate(fixTemplateCreateRequest);
    navigation.navigate('FixRequestImagesLocationStep');
  };

  const nextPageOptions = [{
    label: 'Save Fixit Template & Continue',
    onClick: handleContinue,
  }, {
    label: 'Go to first fix section',
    onClick: () => {
      store.dispatch(fixTemplateActions.updateFixTemplate({ description }));
      navigation.navigate('FixRequestSectionsStep');
    },
  }];

  const render = () : JSX.Element => (
    <>
      <FixRequestHeader
        showBackBtn={true} navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}/>
      <StyledPageWrapper>
        <StepIndicator
          numberSteps={constants.NUMBER_OF_STEPS}
          currentStep={2} />
        <StyledScrollView>
          <StyledContentWrapper>
            <P>
              This section will be part of your new Fixit Template.
              You can fill the the fields with your requirement.
            </P>
            <Spacer height="20px" />
            <FixTemplateFormTextInput
              header={'Fix Description'}
              big={true}
              onChange={(text : string) => setDescription(text)}
              value={description} />
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows secondaryClickOptions={nextPageOptions} />
    </>
  );
  return render();
};

export default FixRequestDescriptionStep;
