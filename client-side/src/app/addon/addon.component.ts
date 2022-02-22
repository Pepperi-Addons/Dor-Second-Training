import { TodoService } from './../services/todo.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { AddonService } from "../services/addon.service";
import { GenericListDataSource } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'addon-module',
    templateUrl: './addon.component.html',
    styleUrls: ['./addon.component.scss']
})
export class AddonComponent implements OnInit {
    @Input() hostObject: any;
    
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    
    screenSize: PepScreenSizeType;

    constructor(
        public addonService: AddonService,
        public router: Router,
        public route: ActivatedRoute,
        public layoutService: PepLayoutService,
        public translate: TranslateService,
        public todoService: TodoService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });
    }

    ngOnInit() {
    }

    openDialog() {
        
    }

    listDataSource: GenericListDataSource = {
        getList: async (state) => {
            return this.todoService.getTodos();
        },

        getDataView: async () => {
            return {
                Context: {
                    Name: '',
                    Profile: { InternalID: 0 },
                    ScreenSize: 'Landscape'
                  },
                  Type: 'Grid',
                  Title: '',
                  Fields: [
                    {
                        FieldID: 'Name',
                        Type: 'TextBox',
                        Title: 'Name',
                        Mandatory: false,
                        ReadOnly: true
                    },
                    {
                        FieldID: 'Description',
                        Type: 'TextBox',
                        Title: 'Description',
                        Mandatory: false,
                        ReadOnly: true
                    },
                    {
                        FieldID: 'DueDate',
                        Type: 'Date',
                        Title: 'Due Date',
                        Mandatory: false,
                        ReadOnly: true
                    },
                    {
                        FieldID: 'Completed',
                        Type: 'Boolean',
                        Title: 'Completed',
                        Mandatory: false,
                        ReadOnly: true
                    }
                  ],
                  Columns: [
                    {
                      Width: 25
                    },
                    {
                      Width: 25
                    },
                    {
                      Width: 25
                    },
                    {
                      Width: 25
                    }
                  ],
                  FrozenColumnsCount: 0,
                  MinimumColumnWidth: 0
            }
        },

        getActions: async (objs) =>  {
            const res = []
            if (objs.length === 1) {
                res.push({
                    title: this.translate.instant("Edit"),
                    handler: async (objs) => {
                        this.router.navigate([objs[0].Key], {
                            relativeTo: this.route,
                            queryParamsHandling: 'merge'
                        });
                    }
                })
            }
            if (objs.length > 0) {
                res.push({
                    title: this.translate.instant("Delete"),
                    handler: async (objs) => {
                        this.todoService.deleteTodos(objs)
                    }
                })
                res.push({
                    title: this.translate.instant("Mark has completed"),
                    handler: async (objs) => {
                        this.todoService.completeTodos(objs)
                    }
                })
            }
            return res
        }
    }
}
