import { npmPackage } from '../plugins/npmPackage/npmPackage';
import { Template } from './template';

interface Answers {
  projectName: string;
}

const template: Template<Answers> = {
  questions: [
    {
      type: 'input',
      name: 'projectName'
    }
  ],
  plugins: [
    npmPackage({
      name: ({ projectName }) => projectName
    })
  ]
};
