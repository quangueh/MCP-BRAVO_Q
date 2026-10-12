var fs = require("fs");
var path = require("path");

console.log("Building...");

// === LAYOUT PARSER ===
var lp = "class LayoutParser {
";
lp += "  parse(xml) {
";
lp += "    var tables=[],dataMembers=[],sources=[],lookups=[],filters=[];
";
lp += "    function extract(p) { var re=new RegExp(p,"g"),r=[],m; while((m=re.exec(xml))!==null){if(r.indexOf(m[1])===-1)r.push(m[1]);} return r; }
";
lp += "    extract("<Name>([^\$<]+)<\/Name>").forEach(function(n){if(n.charAt(0)!=="\$"&&tables.indexOf(n)===-1)tables.push(n);});
";
lp += "    extract("<DataMember>([^<]+)<\/DataMember>").forEach(function(d){if(dataMembers.indexOf(d)===-1)dataMembers.push(d);});
";
lp += "    extract("<Source>([^\$<]+)<\/Source>").forEach(function(s){if(s.charAt(0)!=="\$"&&sources.indexOf(s)===-1)sources.push(s);});
";
lp += "    extract("<LookupKey>([^<]+)<\/LookupKey>").forEach(function(l){if(lookups.indexOf(l)===-1)lookups.push(l);});
";
lp += "    extract("<FilterKey>([^<]+)<\/FilterKey>").forEach(function(f){var d=f.replace(/&lt;/g,"<").replace(/&gt;/g,">");if(filters.indexOf(d)===-1)filters.push(d);});
";
lp += "    return {tables:tables,dataMembers:dataMembers,sources:sources,lookups:lookups,filters:filters};
";
lp += "  }
";
lp += "}
";
lp += "module.exports = LayoutParser;";
fs.writeFileSync("src/engines/layout-parser.js", lp);
console.log("  layout-parser.js OK");

console.log("Done!");