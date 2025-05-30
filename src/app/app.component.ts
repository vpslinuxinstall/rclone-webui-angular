import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { environment } from 'src/environments/environment';

type Theme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') className = '';

  showRemoteSetting = environment.showRemoteSetting;
  showScheduledJobs = environment.electron;
  theme: Theme = 'auto';
  languages = [
    {
      display: 'English',
      code: 'en-US',
    },
    {
      display: 'Deutsch',
      code: 'de-DE',
    },
    {
      display: 'Türkçe',
      code: 'tr-TR',
    },
    {
      display: '简体中文',
      code: 'zh-CN',
    },
  ];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private overlay: OverlayContainer,
  ) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/github-mark-white.svg',
      ),
    );
  }

  ngOnInit(): void {
    const theme = (localStorage.getItem('rwa-theme') as Theme) || 'auto';
    this.activateThemeSetting(theme);
  }

  activateThemeSetting(theme: Theme) {
    localStorage.setItem('rwa-theme', theme);
    this.theme = theme;
    if (theme === 'light') {
      this.activeLightTheme();
    } else if (theme === 'dark') {
      this.activeDarkTheme();
    } else if (theme === 'auto') {
      if (this.getBrowserPreferDarkTheme()) {
        this.activeDarkTheme();
      } else {
        this.activeLightTheme();
      }
    }
  }

  getBrowserPreferDarkTheme() {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkQuery.matches;
  }

  activeDarkTheme() {
    this.className = 'dark-theme dark-theme-basic';
    this.overlay.getContainerElement().classList.add('dark-theme');
  }

  activeLightTheme() {
    this.className = '';
    this.overlay.getContainerElement().classList.remove('dark-theme');
  }

  activateLanguage(languageCode: string) {
    localStorage.setItem('rwa-language', languageCode);
    const hashtag = window.location.hash;
    const newUrl = new URL(
      `../${languageCode}/${hashtag}`,
      window.location.href,
    );
    window.location.href = newUrl.href;
  }
}
