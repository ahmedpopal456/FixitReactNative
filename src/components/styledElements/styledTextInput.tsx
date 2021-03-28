import { colors } from 'fixit-common-ui';
import styled from 'styled-components/native';

const StyledTextInput = styled.TextInput`
    borderColor: ${colors.grey};
    backgroundColor:#fff;
    borderWidth: 1px;
    borderRadius: 8px;
    paddingLeft: 10px;
    paddingRight: 10px;
`;

export default StyledTextInput;
