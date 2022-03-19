import { Skill } from './skill';

export interface Category {
  id: string;
  name: string;
  skills: Array<Skill>;
}
