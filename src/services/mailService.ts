import NodeMailer, { SendMailOptions } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import { User } from '../models/User';

const { GMAIL_ADDRESS, GMAIL_PASSWORD, CLIENT_HOSTNAME } = process.env;

const mailer = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_ADDRESS,
        pass: GMAIL_PASSWORD,
    },
});

const getMailTemplate = async (template: string, replacements: Record<string, string | number>): Promise<string | boolean> => {
    const html = await fs.readFileSync(`${__dirname}/../../templates/${template}.html`, { encoding: 'utf-8' });

    return handlebars.compile(html)(replacements);
};

const send = async (mail: SendMailOptions): Promise<boolean> => new Promise((resolve) => {
    mailer.sendMail(mail, (err) => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
        mailer.close();
    });
});

export const sendRegistrationMail = async (user: User): Promise<boolean> => {
    try {
        const activationLink = `${CLIENT_HOSTNAME}/activation?u=${user._id}&k=${user.activationKey}`;
        const html = await getMailTemplate('registrationMail', { activationLink });

        if (!html) {
            return false;
        }

        const mail: SendMailOptions = {
            subject: 'Inscription à Quiche SSO',
            from: GMAIL_ADDRESS,
            html: html as string,
            to: user.mail,
        };

        return send(mail);
    } catch (e) {
        return false;
    }
};
