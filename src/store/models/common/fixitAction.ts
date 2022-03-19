import { PayloadAction } from '@reduxjs/toolkit';

export type FixitAction<T> = PayloadAction<T, string, string, any | null>;
