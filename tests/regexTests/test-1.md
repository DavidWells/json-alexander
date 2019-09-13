## Test 1

Pattern

```
/'[^\\']*(\\'[^\\']*)*'/g
```

```
/app/src/detect/detect-vuln.pl /tmp/check-regex-1.json 2>>/tmp/check-regex-1-progress.log
{"pattern":"/'[^\\']*(\\'[^\\']*)*'/g","isVulnerable":0,"detectReport":{"memoryLimit":"8192","detectorOpinions":[{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"rathnayake-rxxr2","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.0316"},{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"weideman-RegexStaticAnalysis","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.4568"},{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"wuestholz-RegexCheck","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.2489"},{"secToDecide":"59.9776","opinion":"TIMEOUT","hasOpinion":0,"name":"shen-ReScue"},{"secToDecide":"0.1570","patternVariant":"^(.*?)/'[^\\']*(\\'[^\\']*)*'/g","name":"rathnayake-rxxr2","hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1}},{"secToDecide":"60.0363","name":"weideman-RegexStaticAnalysis","opinion":"TIMEOUT","hasOpinion":0},{"name":"wuestholz-RegexCheck","opinion":{"evilInput":["COULD-NOT-PARSE"],"isSafe":0,"canAnalyze":1},"hasOpinion":1,"secToDecide":"22.8277","patternVariant":"^(.*?)/'[^\\']*(\\'[^\\']*)*'/g"},{"hasOpinion":0,"opinion":"TIMEOUT","name":"shen-ReScue","secToDecide":"60.1099"}],"pattern":"/'[^\\']*(\\'[^\\']*)*'/g","timeLimit":"60"}}
Detectors said: {"memoryLimit":"8192","detectorOpinions":[{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"rathnayake-rxxr2","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.0316"},{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"weideman-RegexStaticAnalysis","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.4568"},{"hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1},"name":"wuestholz-RegexCheck","patternVariant":"/'[^\\']*(\\'[^\\']*)*'/g","secToDecide":"0.2489"},{"secToDecide":"59.9776","opinion":"TIMEOUT","hasOpinion":0,"name":"shen-ReScue"},{"secToDecide":"0.1570","patternVariant":"^(.*?)/'[^\\']*(\\'[^\\']*)*'/g","name":"rathnayake-rxxr2","hasOpinion":1,"opinion":{"canAnalyze":1,"isSafe":1}},{"secToDecide":"60.0363","name":"weideman-RegexStaticAnalysis","opinion":"TIMEOUT","hasOpinion":0},{"name":"wuestholz-RegexCheck","opinion":{"evilInput":["COULD-NOT-PARSE"],"isSafe":0,"canAnalyze":1},"hasOpinion":1,"secToDecide":"22.8277","patternVariant":"^(.*?)/'[^\\']*(\\'[^\\']*)*'/g"},{"hasOpinion":0,"opinion":"TIMEOUT","name":"shen-ReScue","secToDecide":"60.1099"}],"pattern":"/'[^\\']*(\\'[^\\']*)*'/g","timeLimit":"60"}
```

Checking rathnayake-rxxr2 for timeout-triggering evil input
  rathnayake-rxxr2: says not vulnerable
Checking weideman-RegexStaticAnalysis for timeout-triggering evil input
  weideman-RegexStaticAnalysis: says not vulnerable
Checking wuestholz-RegexCheck for timeout-triggering evil input
  wuestholz-RegexCheck: says not vulnerable
Checking shen-ReScue for timeout-triggering evil input
  shen-ReScue: says not vulnerable
Checking rathnayake-rxxr2 for timeout-triggering evil input
  rathnayake-rxxr2: says not vulnerable
Checking weideman-RegexStaticAnalysis for timeout-triggering evil input
  weideman-RegexStaticAnalysis: says not vulnerable
Checking wuestholz-RegexCheck for timeout-triggering evil input
wuestholz-RegexCheck: the regex may be vulnerable (isVariant 0)
  wuestholz-RegexCheck: Could not parse the evil input
Checking shen-ReScue for timeout-triggering evil input
  shen-ReScue: says not vulnerable
