import { IMail } from './IMail';

export interface IMailer {
  send: (mail: IMail) => void;
}
