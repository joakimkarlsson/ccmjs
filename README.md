# ccm

Calculates cyclomatic complexity metrics (CCM) for JavaScript.

## Installation
```
$ npm install -g ccm
```

## Command line options
```
ccm --files "path/**/of/files/to/include/*.js" --exclude "exclude/**/this" --exclude "this/as/well" --results [NUM]
```
## Output

ccm will parse all files specifed by the `--files` and `--exclude` arguments and list the functions that has the highest ccm. The number of functions to include in the result is specified by --results`.
