import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../@vex/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../../@vex/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from '../../@vex/services/config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SidebarComponent } from '../../@vex/components/sidebar/sidebar.component';
import { AuthenticationService } from '../core';
import { CoreService } from '../core/core.service';
import { User } from '../models/user.model';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';
import { ChatService } from '../core/api/chat.service';

@Component({
    selector: 'vex-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

    sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
    isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
    isDesktop$ = this.layoutService.isDesktop$;
    loaded = false;

    toolbarShadowEnabled$ = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
    );

    @ViewChild('configpanel', { static: false }) configpanel: SidebarComponent;

    constructor(
        private authenticationService: AuthenticationService,
        private coreService: CoreService,
        private layoutService: LayoutService,
        private configService: ConfigService,
        private splashScreen: SplashScreenService,
        private breakpointObserver: BreakpointObserver,
        private chatService: ChatService,
        private router: Router) { }

    ngOnInit() {
        this.layoutService.configpanelOpen$.pipe(
            untilDestroyed(this)
        ).subscribe(open => open ? this.configpanel?.open() : this.configpanel?.close());

        // console.log('shell init');
        const userParams = 'id, name, last_name, chat_id, doctor{id, chat_id, name, avatar_url, in_place_price, virtual_price}';
        // check if user session is valid
        this.authenticationService.checkUser(userParams).subscribe(
            (response: any) => {
                console.log('user session is valid...');
                this.coreService.setUser(new User().deserialize(response.data.me));

                this.chatService.login(response.data.me.chat_id);
                this.chatService.updateUserChats(response.data.me.chat_id);
                // this.coreService.setCompany(this.currentCompany);
                // this.showContent = true;
                this.splashScreen.hide();
                this.loaded = true;
            },
            error => {
                console.log('user session denied, logging out...');
                this.splashScreen.hide();
                // this.authenticationService.logout();
                this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
                this.loaded = true;
            }
        );
    }

    ngOnDestroy(): void {
        this.chatService.logout();
    }
}
