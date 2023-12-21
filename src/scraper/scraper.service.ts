import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { format, subDays } from 'date-fns';

@Injectable()
export class ScraperService {
  constructor() {}

  async search() {
    const currentDate = new Date();

    const prevDay = subDays(currentDate, 1);

    const formattedPrevDay = format(prevDay, 'yyyy-MM-dd');
    const formattedCurrentDay = format(currentDate, 'yyyy-MM-dd');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const searchQuery = `site:lever.co | site:greenhouse.io | site:jobs.ashbyhq.com | site:apply.workable.com | site:app.dover.io | site:talentlyft.com | site:jobs.polymer.co | site:recruitee.com | site:jobvite.com | site:jobs.smartrecruiters.com (Frontend engineer | full stack developer | full stack engineer) 'react'  after:${formattedPrevDay} before:${formattedCurrentDay}`;

    await page.goto(`https://www.google.com/search?q=${searchQuery}`);

    const links = await page.$$eval('a', (anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href')),
    );

    const cleanedLinks = links
      .filter((link) => link && link.startsWith('http'))
      .slice(9);
    await this.sendEmail(
      [
        'bankolek1@gmail.com',
        'bankolek5@gmail.com',
        'eugeneishado44@gmail.com',
      ],
      'job links',
      cleanedLinks,
      searchQuery,
    );

    await browser.close();
    return { cleanedLinks };
  }

  async sendEmail(
    userEmails: string[],
    subject: string,
    urls: string[],
    query: string,
  ): Promise<void> {
    const handlebarsOptions = {
      viewEngine: {
        extName: '.hbs',
        defaultLayout: '',
      },
      viewPath: './src/emails',
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
      to: userEmails,
      subject: subject,
      template: 'email',
      text_template: 'email',
      context: { urls, query, date: new Date().toLocaleDateString() },
    };

    await transporter.sendMail(mailOptions);
  }
}
