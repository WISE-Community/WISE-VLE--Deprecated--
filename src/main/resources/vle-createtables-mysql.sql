
    create table annotation (
        id bigint not null auto_increment,
        annotateTime datetime,
        data longtext,
        postTime datetime,
        runId bigint,
        type varchar(255),
        fromUser_id bigint,
        stepWork_id bigint,
        toUser_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table chatlog (
        id bigint not null auto_increment,
        chatEventType varchar(255) not null,
        chatRoomId varchar(255),
        data varchar(4096),
        dataType varchar(255),
        fromWorkgroupId bigint not null,
        fromWorkgroupName varchar(255),
        postTime datetime not null,
        runId bigint not null,
        status varchar(255),
        toWorkgroupId bigint,
        toWorkgroupName varchar(255),
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table craterrequest (
        id bigint not null auto_increment,
        cRaterItemId varchar(255) not null,
        cRaterItemType varchar(255),
        cRaterResponse varchar(2048),
        failCount integer,
        nodeStateId bigint not null,
        runId bigint not null,
        timeCompleted datetime,
        timeCreated datetime,
        stepWorkId bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table ideaBasket (
        id bigint not null auto_increment,
        action varchar(255),
        actionPerformer bigint,
        data longtext,
        ideaId bigint,
        ideaWorkgroupId bigint,
        isPublic bit,
        periodId bigint,
        postTime datetime,
        projectId bigint,
        runId bigint,
        workgroupId bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table journal (
        id bigint not null auto_increment,
        data varchar(1024),
        userInfo_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table node (
        id bigint not null auto_increment,
        nodeId varchar(255),
        nodeType varchar(255),
        runId varchar(255),
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table peerreviewgate (
        id bigint not null auto_increment,
        open bit,
        periodId bigint,
        runId bigint,
        node_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table peerreviewwork (
        id bigint not null auto_increment,
        periodId bigint,
        runId bigint,
        annotation_id bigint,
        node_id bigint,
        reviewerUserInfo_id bigint,
        stepWork_id bigint,
        userInfo_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table stepwork (
        id bigint not null auto_increment,
        data longtext,
        duplicateId varchar(255),
        endTime datetime,
        postTime datetime,
        startTime datetime,
        node_id bigint,
        userInfo_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table stepwork_cache (
        id bigint not null auto_increment,
        cacheTime datetime,
        data longtext,
        getRevisions bit,
        userInfo_id bigint,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table userinfo (
        id bigint not null auto_increment,
        workgroupId bigint unique,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    create table vle_statistics (
        id bigint not null auto_increment,
        data varchar(5000),
        timestamp datetime,
        primary key (id)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    alter table annotation 
        add index FKA34FEB2FE8A0978C (stepWork_id), 
        add constraint FKA34FEB2FE8A0978C 
        foreign key (stepWork_id) 
        references stepwork (id);

    alter table annotation 
        add index FKA34FEB2F3428BDA5 (toUser_id), 
        add constraint FKA34FEB2F3428BDA5 
        foreign key (toUser_id) 
        references userinfo (id);

    alter table annotation 
        add index FKA34FEB2F9AE3D196 (fromUser_id), 
        add constraint FKA34FEB2F9AE3D196 
        foreign key (fromUser_id) 
        references userinfo (id);

    alter table craterrequest 
        add index FKC84ADEA0E624A887 (stepWorkId), 
        add constraint FKC84ADEA0E624A887 
        foreign key (stepWorkId) 
        references stepwork (id);

    alter table journal 
        add index FKAB64AF37206FE92 (userInfo_id), 
        add constraint FKAB64AF37206FE92 
        foreign key (userInfo_id) 
        references userinfo (id);

    alter table peerreviewgate 
        add index FKD0AB7705D11C35FB (node_id), 
        add constraint FKD0AB7705D11C35FB 
        foreign key (node_id) 
        references node (id);

    alter table peerreviewwork 
        add index FKD0B2F14BD11C35FB (node_id), 
        add constraint FKD0B2F14BD11C35FB 
        foreign key (node_id) 
        references node (id);

    alter table peerreviewwork 
        add index FKD0B2F14B2CBBDF0E (annotation_id), 
        add constraint FKD0B2F14B2CBBDF0E 
        foreign key (annotation_id) 
        references annotation (id);

    alter table peerreviewwork 
        add index FKD0B2F14BD10BEB6D (reviewerUserInfo_id), 
        add constraint FKD0B2F14BD10BEB6D 
        foreign key (reviewerUserInfo_id) 
        references userinfo (id);

    alter table peerreviewwork 
        add index FKD0B2F14BE8A0978C (stepWork_id), 
        add constraint FKD0B2F14BE8A0978C 
        foreign key (stepWork_id) 
        references stepwork (id);

    alter table peerreviewwork 
        add index FKD0B2F14B206FE92 (userInfo_id), 
        add constraint FKD0B2F14B206FE92 
        foreign key (userInfo_id) 
        references userinfo (id);

    alter table stepwork 
        add index FK553587DDD11C35FB (node_id), 
        add constraint FK553587DDD11C35FB 
        foreign key (node_id) 
        references node (id);

    alter table stepwork 
        add index FK553587DD206FE92 (userInfo_id), 
        add constraint FK553587DD206FE92 
        foreign key (userInfo_id) 
        references userinfo (id);

    alter table stepwork_cache 
        add index FK953280A0206FE92 (userInfo_id), 
        add constraint FK953280A0206FE92 
        foreign key (userInfo_id) 
        references userinfo (id);
