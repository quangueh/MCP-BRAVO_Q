class LayoutParser {
  parse(xml) {
    var tables=[],dataMembers=[],sources=[],lookups=[],filters=[];
    function extract(p) { var re=new RegExp(p,"g"),r=[],m; while((m=re.exec(xml))!==null){if(r.indexOf(m[1])===-1)r.push(m[1]);} return r; }
    extract("<Name>([^$<]+)</Name>").forEach(function(n){if(n.charAt(0)!=="$"&&tables.indexOf(n)===-1)tables.push(n);});
    extract("<DataMember>([^<]+)</DataMember>").forEach(function(d){if(dataMembers.indexOf(d)===-1)dataMembers.push(d);});
    extract("<Source>([^$<]+)</Source>").forEach(function(s){if(s.charAt(0)!=="$"&&sources.indexOf(s)===-1)sources.push(s);});
    extract("<LookupKey>([^<]+)</LookupKey>").forEach(function(l){if(lookups.indexOf(l)===-1)lookups.push(l);});
    extract("<FilterKey>([^<]+)</FilterKey>").forEach(function(f){var d=f.replace(/&lt;/g,"<").replace(/&gt;/g,">");if(filters.indexOf(d)===-1)filters.push(d);});
    return {tables:tables,dataMembers:dataMembers,sources:sources,lookups:lookups,filters:filters};
  }
}
module.exports = LayoutParser;