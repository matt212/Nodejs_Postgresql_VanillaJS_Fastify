let base = {
  paginationset: function (tunnel) {
    return (
      " limit " + tunnel.arg.pageSize + " offset " + tunnel.arg.next_offset
    );
  },
  sortorder: function (tunnel) {
    return (
      " ORDER BY " + tunnel.arg.sortcolumn + " " + tunnel.arg.sortcolumnorder
    );
  },
  basesearchtype: function (tunnel) {
    return (
      "select  " +
      tunnel.fieldnames +
      " from " +
      tunnel.mod.Name +
      " as a where a.recordstate=true and  " +
      tunnel.arg.daterange +
      "  " +
      tunnel.arg.selector +
      "  " +
      tunnel.arg.consolidatesearch
    );
  },
  searchType: function (tunnel) {
    return (
      this.basesearchtype(tunnel) +
      this.sortorder(tunnel) +
      this.paginationset(tunnel)
    );
  },
  searchTypeCount: function (tunnel) {
    return (
      " select COUNT(*) as count   from " +
      tunnel.mod.Name +
      " as a where a.recordstate=true and  " +
      tunnel.arg.daterange +
      "  " +
      tunnel.arg.selector +
      "  " +
      tunnel.arg.consolidatesearch
    );
  },
  searchTypeCountExplain: function (tunnel) {
    return (
      " EXPLAIN  select * from " +
      tunnel.mod.Name +
      " as a where a.recordstate=true and  " +
      tunnel.arg.daterange +
      "  " +
      tunnel.arg.selector +
      "  " +
      tunnel.arg.consolidatesearch
    );
  },
  searchTypeFilter: function (tunnel) {
    return this.basesearchtype(tunnel);
  },
  searchTypeFilterProgressBar: function (tunnel) {
    return ("EXPLAIN (ANALYSE,FORMAT JSON) " + this.basesearchtype(tunnel));
  },
  searchtypegroupby: function (tunnel) {
    return (
      "select  a." +
      tunnel.tempDep.searchkey +
      " from " +
      tunnel.mod.Name +
      " as a where  " +
      tunnel.tempDep.selector +
      " " +
      tunnel.tempDep.colmetafilter +
      " group by " +
      tunnel.tempDep.searchkey +
      "  ORDER BY " +
      tunnel.tempDep.searchkey +
      " " +
      tunnel.tempDep.sortcolumnorder +
      "  limit 20"
    );
  },
  searchtypegroupbyId: function (tunnel) {
    return (
      "select  a." +
      tunnel.tempDep.searchkey +
      ",a." +
      tunnel.mod.id +
      " from " +
      tunnel.mod.Name +
      " as a where  " +
      tunnel.tempDep.selector +
      " " +
      tunnel.tempDep.colmetafilter +
      " group by " +
      tunnel.tempDep.searchkey +", "+
      tunnel.mod.id +
      "  ORDER BY " +
      tunnel.tempDep.searchkey +
      " " +
      tunnel.tempDep.sortcolumnorder +
      "  limit 20"
    );
  },
  SqlPivot: function (tunnel) {
    return (
      "select " +
      tunnel.arg1.resultsetselect +
      " from (select coalesce(yaxis, 'total') as yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (select yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (SELECT * " +
      "FROM   crosstab(" +
      "'select  " +
      tunnel.tempDep.baseYaxisparam +
      "," +
      tunnel.tempDep.baseXaxisparam +
      ",count(*)::int as cnt   from  " +
      tunnel.mod.Name +
      " as a where recordstate=true and  " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      "  group by Xaxis, Yaxis  order by  1,2 asc '," +
      " 'select " +
      tunnel.tempDep.baseXaxisparam +
      " from " +
      tunnel.mod.Name +
      " as a where recordstate=true and  " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      " group by Xaxis   order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      "')" +
      "AS orders(" +
      "Yaxis text," +
      tunnel.arg1.resultsetintern +
      ") ) as Xaxisderived group by yaxis limit " +
      tunnel.tempDep.YpageSize +
      " offset " +
      tunnel.tempDep.Ynext_offset +
      ") as a group by  rollup(yaxis) ) as a"
    );
  },
  sqlstatementsprimaryPivot: function (tunnel) {
    return (
      "select count(*) as totalyaxiscnt from (select  " +
      tunnel.tempDep.baseYaxisparamprimary +
      " from " +
      tunnel.mod.Name +
      " as a where recordstate=true and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      " group by Yaxis ) as Yaxisderived"
    );
  },
  sqlstatementsecondaryPivot: function (tunnel) {
    return (
      "select count(*) as totalxaxiscnt from (select  " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from " +
      tunnel.mod.Name +
      " as a where recordstate=true and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      "  group by Xaxis ) as Xaxisderived"
    );
  },
  sqlstatepivotcol: function (tunnel) {
    return (
      "select " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from " +
      tunnel.mod.Name +
      " as a where recordstate=true and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      " group by Xaxis  order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      ";"
    );
  }
};
let mrole = {
  basesqlscrp: {
    a:
      "select a.mroleid, a.recordstate,rl.roleid AS roleid,n.modnameid as modID, n.Mname as Modulename,n.Mname as mname,rl.rolename as Rolename, a.accesstype as accesstype  from mrole a " +
      "left join modname n " +
      "on a.modulename::int=n.modnameid " +
      "left join role rl " +
      "on rl.roleid=a.rolename::int " +
      "where a.recordstate=true "
  },
  basesearchtype: function (tunnel) {
    return (
      "select   Rolename, " +
      "string_agg(distinct Modulename,',')as Modulename," +
      "string_agg(distinct accesstype,',') as Accesstype ,recordstate," +
      "string_agg(distinct ModID::text,',') as modulenameid, string_agg(distinct ModID::text,',') as mname , " +
      "string_agg(distinct roleid::text,',') as mroleID," +
      "ROLEID as RoleID from " +
      "( " +
      this.basesqlscrp.a +
      "and " +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      " ) as a " +
      tunnel.arg.consolidatesearch +
      "  GROUP BY ROLEID,Rolename,recordstate "
    );
  },
  searchType: function (tunnel) {
    return this.basesearchtype(tunnel) + base.paginationset(tunnel);
  },
  searchTypeCount: function (tunnel) {
    return (
      "select  count(*) as count  " +
      "from " +
      "( " +
      this.basesqlscrp.a +
      "and " +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      " ) as a " +
      tunnel.arg.consolidatesearch +
      "  GROUP BY ROLEID,Rolename,recordstate "
    );
  },
  searchTypeCountExplain: function (tunnel) {
    return (
      "Explain select  * " +
      "from " +
      "( " +
      this.basesqlscrp.a +
      "and " +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      " ) as a " +
      tunnel.arg.consolidatesearch +
      "  GROUP BY ROLEID,Rolename,recordstate "
    );
  },
  searchtypegroupby: function (tunnel) {
    return (
      "select  a." +
      tunnel.tempDep.searchkey +
      " , " +
      tunnel.tempDep.searchparamkey +
      "  from (" +
      this.basesqlscrp.a +
      ") as a where  " +
      tunnel.tempDep.selector +
      " " +
      tunnel.tempDep.colmetafilter +
      " group by " +
      tunnel.tempDep.searchkey +
      " ," +
      tunnel.tempDep.searchparamkey +
      "  ORDER BY " +
      tunnel.tempDep.searchkey +
      " " +
      tunnel.tempDep.sortcolumnorder +
      "  limit 20"
    );
  },
  searchTypeFilter: function (tunnel) {
    return this.basesearchtype(tunnel);
  },
  searchTypeFilterProgressBar: function (tunnel) {
    return "EXPLAIN (ANALYSE,FORMAT JSON)   " + this.basesearchtype(tunnel);
  },
  SqlPivot: function (tunnel) {
    return (
      "select " +
      tunnel.arg1.resultsetselect +
      " from (select coalesce(yaxis, 'total') as yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (select yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (SELECT * " +
      "FROM   crosstab(" +
      "'select  " +
      tunnel.tempDep.baseYaxisparam +
      "," +
      tunnel.tempDep.baseXaxisparam +
      ",count(*)::int as cnt   from  " +
      " (" +
      this.basesqlscrp.a +
      " and " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      ") as a  " +
      "  group by Xaxis, Yaxis  order by  1,2 asc '," +
      " 'select " +
      tunnel.tempDep.baseXaxisparam +
      " from " +
      " (" +
      this.basesqlscrp.a +
      "  and  " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      ") as a  " +
      " group by Xaxis   order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      "')" +
      "AS orders(" +
      "Yaxis text," +
      tunnel.arg1.resultsetintern +
      ") ) as Xaxisderived group by yaxis limit " +
      tunnel.tempDep.YpageSize +
      " offset " +
      tunnel.tempDep.Ynext_offset +
      ") as a group by  rollup(yaxis) ) as a"
    );
  },
  sqlstatementsprimaryPivot: function (tunnel) {
    return (
      "select count(*) as totalyaxiscnt from (select  " +
      tunnel.tempDep.baseYaxisparamprimary +
      " from (" +
      this.basesqlscrp.a +
      " and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a " +
      " group by Yaxis ) as Yaxisderived"
    );
  },
  sqlstatementsecondaryPivot: function (tunnel) {
    return (
      "select count(*) as totalxaxiscnt from (select  " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from (" +
      this.basesqlscrp.a +
      " and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a   " +
      "  group by Xaxis ) as Xaxisderived"
    );
  },
  sqlstatepivotcol: function (tunnel) {
    return (
      "select " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from " +
      " (" +
      this.basesqlscrp.a +
      " and " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a " +
      " group by Xaxis  order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      ";"
    );
  }
};
let userrole = {
  basesqlscrp: {
    a:
      " SELECT userrolemappingID,r.Rolename, u.Username,a.recordstate,a.muserID ,a.RoleID  FROM userrolemapping a" +
      " left join role r on r.RoleID=a.RoleID " +
      " left join muser u on u.muserID=a.muserID " +
      " where a.recordstate=true "
  },
  basesearchtype: function (tunnel) {
    return (
      "select" +
      " string_agg(distinct userrolemappingID::text,',') as userrolemappingID," +
      " string_agg(distinct muserID::text,',') as muserID ," +
      " string_agg(distinct Username,',') as Username ," +
      " string_agg(distinct Rolename::text,',') as Rolename," +
      " string_agg(distinct RoleID::text,',') as RoleID ," +
      "  recordstate  " +
      "from " +
      "( " +
      this.basesqlscrp.a +
      "and " +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      " ) as a " +
      tunnel.arg.consolidatesearch +
      "  GROUP BY Username,recordstate,muserID "
    );
  },
  searchType: function (tunnel) {
    return this.basesearchtype(tunnel) + base.paginationset(tunnel);
  },
  searchTypeCount: function (tunnel) {
    return (
      "select  count(*) as count  " +
      "from " +
      "( " +
      this.basesqlscrp.a +
      "and " +
      tunnel.arg.daterange +
      tunnel.arg.selector +
      " ) as a " +
      tunnel.arg.consolidatesearch +
      "  GROUP BY Username,recordstate,muserID "
    );
  },
  searchtypegroupby: function (tunnel) {
    return (
      "select  a." +
      tunnel.tempDep.searchkey +
      " , " +
      tunnel.tempDep.searchparamkey +
      "  from (" +
      this.basesqlscrp.a +
      ") as a where  " +
      tunnel.tempDep.selector +
      " " +
      tunnel.tempDep.colmetafilter +
      " group by " +
      tunnel.tempDep.searchkey +
      " ," +
      tunnel.tempDep.searchparamkey +
      "  ORDER BY " +
      tunnel.tempDep.searchkey +
      " " +
      tunnel.tempDep.sortcolumnorder +
      "  limit 20"
    );
  },
  searchTypeFilter: function (tunnel) {
    return this.basesearchtype(tunnel);
  },
  searchTypeFilterProgressBar: function (tunnel) {
    return "EXPLAIN (ANALYSE,FORMAT JSON)   " + this.basesearchtype(tunnel);
  },
  SqlPivot: function (tunnel) {
    return (
      "select " +
      tunnel.arg1.resultsetselect +
      " from (select coalesce(yaxis, 'total') as yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (select yaxis , " +
      tunnel.arg1.resultsetinternrollup +
      " from (SELECT * " +
      "FROM   crosstab(" +
      "'select  " +
      tunnel.tempDep.baseYaxisparam +
      "," +
      tunnel.tempDep.baseXaxisparam +
      ",count(*)::int as cnt   from  " +
      " (" +
      this.basesqlscrp.a +
      " and " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      ") as a  " +
      "  group by Xaxis, Yaxis  order by  1,2 asc '," +
      " 'select " +
      tunnel.tempDep.baseXaxisparam +
      " from " +
      " (" +
      this.basesqlscrp.a +
      "  and  " +
      tunnel.tempDep.dynamicquerydaterange +
      "  " +
      tunnel.tempDep.selectordynamic +
      "  " +
      tunnel.tempDep.consolidatesearchdynamic +
      ") as a  " +
      " group by Xaxis   order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      "')" +
      "AS orders(" +
      "Yaxis text," +
      tunnel.arg1.resultsetintern +
      ") ) as Xaxisderived group by yaxis limit " +
      tunnel.tempDep.YpageSize +
      " offset " +
      tunnel.tempDep.Ynext_offset +
      ") as a group by  rollup(yaxis) ) as a"
    );
  },
  sqlstatementsprimaryPivot: function (tunnel) {
    return (
      "select count(*) as totalyaxiscnt from (select  " +
      tunnel.tempDep.baseYaxisparamprimary +
      " from (" +
      this.basesqlscrp.a +
      " and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a " +
      " group by Yaxis ) as Yaxisderived"
    );
  },
  sqlstatementsecondaryPivot: function (tunnel) {
    return (
      "select count(*) as totalxaxiscnt from (select  " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from (" +
      this.basesqlscrp.a +
      " and  " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a   " +
      "  group by Xaxis ) as Xaxisderived"
    );
  },
  sqlstatepivotcol: function (tunnel) {
    return (
      "select " +
      tunnel.tempDep.baseXaxisparamprimary +
      " from " +
      " (" +
      this.basesqlscrp.a +
      " and " +
      tunnel.tempDep.daterange +
      "  " +
      tunnel.tempDep.selector +
      "  " +
      tunnel.tempDep.consolidatesearch +
      ") as a " +
      " group by Xaxis  order by 1 limit " +
      tunnel.tempDep.XpageSize +
      " offset " +
      tunnel.tempDep.Xnext_offset +
      ";"
    );
  }
};
module.exports = {
  base: base,
  mrole: mrole,
  userrole: userrole
};
