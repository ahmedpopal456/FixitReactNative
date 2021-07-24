import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { PropsWithChildren } from 'react';

export interface HeaderProps extends PropsWithChildren<any>{
    /** Title of the Header */
    title?: string,
    /** Navigation Stack */
    navigation: StackNavigationProp<ParamListBase, string>,
    /** Background Color of the Header */
    backgroundColor?: string,
    /** Height of the Header */
    height?: number,
    /** If provided, notifications will be rendered */
    notificationsBadgeCount?:number
    /** If provided, ratings will be rendered */
    userRatings?:number,
    /** User's First Name */
    userFirstName?:string
  }
