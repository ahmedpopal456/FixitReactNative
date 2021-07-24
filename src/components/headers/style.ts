import styled from 'styled-components/native';
import { HeaderProps } from './headerProps';

const ViewWrapper = styled.View`
    display: flex;
    flexDirection: row;
    width:100%;
    justify-content: space-between;
    ${(props:HeaderProps) => `
        backgroundColor: ${props.backgroundColor};
        height: ${props.height}px;
        `}
`;

export default ViewWrapper;
