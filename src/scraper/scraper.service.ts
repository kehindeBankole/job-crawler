import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class ScraperService {
  constructor() {}

  async search() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const searchQuery =
      'site:linkedin.com | site:lever.co | site:greenhouse.io | site:jobs.ashbyhq.com frontend';

    await page.goto(`https://www.google.com/search?q=${searchQuery}`);

    const links = await page.$$eval('a', (anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href')),
    );

    // Filter and clean up the links
    const cleanedLinks = links
      .filter((link) => link && link.startsWith('http'))
      .slice(9);
    await this.sendEmail('bankolek1@gmail.com', 'job links', cleanedLinks);

    await browser.close();
    return { cleanedLinks };
  }

  async sendEmail(
    userEmail: string,
    subject: string,
    urls: string[],
  ): Promise<void> {
    const handlebarsOptions = {
      viewEngine: {
        extName: '.hbs',
        defaultLayout: '', // Layout file (optional)
      },
      viewPath: './src/emails', // Directory containing email templates
      extName: '.hbs',
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bankolek1@gmail.com',
        pass: 'vdza jwsy lgwv pcbs',
      },
    });
    transporter.use('compile', hbs(handlebarsOptions));

    const mailOptions = {
      from: 'bankolek1@gmail.com',
      to: userEmail,
      subject: subject,
      template: 'email',
      text_template: 'email',
      context: { urls, date: new Date().toLocaleDateString() },
    };

    await transporter.sendMail(mailOptions);
  }
}
