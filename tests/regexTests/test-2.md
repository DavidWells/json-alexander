# Test 2

Pattern

```
/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g
```

```
/app/src/detect/detect-vuln.pl /tmp/check-regex-1.json 2>>/tmp/check-regex-1-progress.log
Detectors said: {"detectorOpinions":[{"opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"rathnayake-rxxr2","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","hasOpinion":1,"secToDecide":"0.0240"},{"name":"weideman-RegexStaticAnalysis","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.1938","hasOpinion":1},{"patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","name":"wuestholz-RegexCheck","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.2046","hasOpinion":1},{"hasOpinion":1,"secToDecide":"0.3073","opinion":{"canAnalyze":false,"isSafe":true,"evilInput":[]},"name":"shen-ReScue","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","name":"rathnayake-rxxr2","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.0270","hasOpinion":1},{"hasOpinion":1,"secToDecide":"0.1751","opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"weideman-RegexStaticAnalysis","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"hasOpinion":1,"secToDecide":"0.2082","opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"wuestholz-RegexCheck","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"opinion":{"canAnalyze":false,"evilInput":[],"isSafe":true},"name":"shen-ReScue","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","hasOpinion":1,"secToDecide":"0.3085"}],"timeLimit":"60","pattern":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","memoryLimit":"8192"}
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
  wuestholz-RegexCheck: says not vulnerable
Checking shen-ReScue for timeout-triggering evil input
  shen-ReScue: says not vulnerable

```
{"isVulnerable":0,"pattern":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","detectReport":{"detectorOpinions":[{"opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"rathnayake-rxxr2","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","hasOpinion":1,"secToDecide":"0.0240"},{"name":"weideman-RegexStaticAnalysis","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.1938","hasOpinion":1},{"patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","name":"wuestholz-RegexCheck","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.2046","hasOpinion":1},{"hasOpinion":1,"secToDecide":"0.3073","opinion":{"canAnalyze":false,"isSafe":true,"evilInput":[]},"name":"shen-ReScue","patternVariant":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","name":"rathnayake-rxxr2","opinion":{"canAnalyze":0,"isSafe":"UNKNOWN"},"secToDecide":"0.0270","hasOpinion":1},{"hasOpinion":1,"secToDecide":"0.1751","opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"weideman-RegexStaticAnalysis","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"hasOpinion":1,"secToDecide":"0.2082","opinion":{"isSafe":"UNKNOWN","canAnalyze":0},"name":"wuestholz-RegexCheck","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g"},{"opinion":{"canAnalyze":false,"evilInput":[],"isSafe":true},"name":"shen-ReScue","patternVariant":"^(.*?)/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","hasOpinion":1,"secToDecide":"0.3085"}],"timeLimit":"60","pattern":"/^(?:\\s+)?([[{(])(\\s+)?(['|\"])/g","memoryLimit":"8192"}}
```
