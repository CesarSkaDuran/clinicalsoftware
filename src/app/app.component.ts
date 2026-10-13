import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';
import icAssignment from '@iconify/icons-feather/file-text';
import icEvent from '@iconify/icons-feather/calendar';
import icInform from '@iconify/icons-feather/alert-circle';
import icAdmin from '@iconify/icons-feather/dollar-sign';
import icHome from '@iconify/icons-feather/home';
import icMinus from '@iconify/icons-feather/minus';
import icVirtual from '@iconify/icons-feather/cast';
import icPerson from '@iconify/icons-feather/user-plus';
import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { Style, StyleService } from '../@vex/services/style.service';
import { ConfigName } from '../@vex/interfaces/config-name.model';
import baselineMonetizationOn from '@iconify/icons-ic/baseline-monetization-on';
@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vex';

  constructor(private configService: ConfigService,
              private styleService: StyleService,
              private renderer: Renderer2,
              private platform: Platform,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) private localeId: string,
              private layoutService: LayoutService,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private splashScreenService: SplashScreenService) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));


    this.navigationService.items = [
      {
        type: 'subheading',
        label: 'Menú principal',
        children: [
          {
            type: 'link',
            label: 'Inicio',
            route: '/app/home',
            icon: icHome
          },
          {
            type: 'link',
            label: 'Pacientes',
            route: '/app/records',
            icon: icAssignment
          },
          {
            type: 'dropdown',
            label: 'Citas',
            icon: icEvent,
            children: [
              {
                type: 'link',
                label: 'Calendario',
                route: '/app/appointment',
                icon: icMinus,
              },
              // {
              //   type: 'link',
              //   label: 'Horario Médico',
              //   route: '/app/appointment',
              //   icon: icMinus,
              // },
              // {
              //   type: 'link',
              //   label: 'Nueva Cita',
              //   route: '/app/appointment',
              //   icon: icMinus,
              // }
            ]
          },
          // {
          //   type: 'link',
          //   label: 'Teleorientación',
          //   route: '/app/telemedicine',
          //   icon: icVirtual
          // },
          {
            type: 'link',
            label: 'Pagos',
            route: '/app/administration',
            icon: icAdmin
          },
          {
            type: 'link',
            label: 'Gastos',
            route: '/app/gastos',
            icon: baselineMonetizationOn
          },
          {
            type: 'link',
            label: 'RIPS sin factura',
            route: '/app/rips-sin-factura',
            icon: icAssignment
          },

          {
            type: 'dropdown',
              label: 'Informes',
            icon: icEvent,
            children: [
              {
                type: 'link',
                label: 'Cierre Dia',
                route: '/app/cierre',
                icon: icMinus,
              },
            ]
          },
        ]
      }, {
        type: 'subheading',
        label: 'Acceso rápido',
        children: [
          {
            type: 'link',
            label: 'Calendario',
            route: '/app/appointment',
            icon: icEvent
          }
        ]
      }
    ];
  }
}
