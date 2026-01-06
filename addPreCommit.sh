#!/bin/bash
file_location=.git/hooks/pre-commit
if [ -e $file_location ]; then
  echo "Pre-Commit file already exists"
else
  cat > $file_location <<EOF
#!/bin/bash
#
# A pre-commit hook to ensure that Maisonette tests and code linting is run.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#

npm run lint && npm run tests
EOF

chmod 755 $file_location
fi
