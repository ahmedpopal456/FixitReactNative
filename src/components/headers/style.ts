import styled from 'styled-components/native';
import { HeaderProps } from './headerProps';

const ViewWrapper = styled.SafeAreaView`
    display: flex;
    flexDirection: row;
    flexWrap: wrap;
    width:100%;
    justifyContent: space-between;
    ${(props:HeaderProps) => `
        backgroundColor: ${props.backgroundColor};
        height: ${props.height}px;
        `}
`;

export default ViewWrapper;
