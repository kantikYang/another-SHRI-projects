//ne только сортировка с комментами
function sortNode(node) {
  return node.slice().sort((a, b) => {
    const res = findWeight(a) - findWeight(b);
    if (res === 0) {
      if (a.type == 'VariableDeclaration') {
        return a.declarations[0].init.source.value.localeCompare(
          b.declarations[0]
        ).init.source.value;
      } else {
        return a.source.value.localeCompare(b.source.value);
      }
    }
    return res;
  });
}

const findWeight = (item) => {
  if (item.type == 'VariableDeclaration') {
    //console.log(item.declarations[0].init.source.value)//[iVariableDeclarator].init.source.value);
    return 5;
  }

  const path = item.source.value;

  if (/^@/.test(path)) {
    return 1;
  } else if (/^\w/.test(path)) {
    return 2;
  } else if (/^\.\./.test(path)) {
    return 3;
  } else if (/^\./.test(path)) {
    return 4;
  }
};

const startRange = (node) => {
  return node.range[0];
};

const endRange = (node) => {
  return node.range[1];
};

module.exports = {
  meta: {
    fixable: 'code',
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const setNode = [];

    function checkComment(node) {
      let allComment = sourceCode.getCommentsBefore(node);
      let isCom = false;
      let comment;
      let range;

      if (allComment.length > 0) {
        let endComment = allComment[0].range[1];
        let currentIndex = 0;
        while (currentIndex < allComment.length - 1) {
          if (endComment + 1 === allComment[currentIndex + 1].range[0]) {
            endComment = allComment[currentIndex + 1].range[1];
            currentIndex++;
          } else {
            break;
          }
        }

        if (node.range[0] === endComment + 1) {
          isCom = true;
          range = [allComment[0].range[0], endComment];
          const commentLines = allComment
            .slice(0, currentIndex + 1)
            .map((comment) => {
              if (comment.value.split('\n').length > 1) {
                return '/*' + comment.value + '*/';
              } else {
                return '//' + comment.value;
              }
            });
          comment = commentLines.join('\n');
        }
      }
      return { isCom, comment, range };
    }

    return {
      Program(node) {
        node.body.forEach((item) => {
          const typeNode = item.type;

          if (
            typeNode == 'ImportDeclaration' ||
            typeNode == 'VariableDeclaration'
          ) {
            setNode.push(item);
            //console.log(findWeight(item));
          }
        });
        //console.log(setNode);
        const sortSetNode = sortNode(setNode);
        //console.log(sortSetNode);

        setNode.forEach((importNode, i) => {
          const sortImportNode = sortSetNode[i];

          //console.log(startRange(importNode))

          if (importNode !== sortImportNode) {
            context.report({
              node: importNode,
              message: 'not sorted',
              fix(fixer) {
                let myRange = [];
                const newNode = checkComment(sortImportNode);
                const replaceNode = checkComment(importNode);

                if (replaceNode.isCom) {
                  myRange[0] = replaceNode.range[0];
                } else {
                  myRange[0] = importNode.range[0];
                }

                if (setNode.length - 1 === i) {
                  myRange[1] = importNode.range[1];
                } else {
                  const curCom = checkComment(setNode[i + 1]);
                  myRange[1] = curCom.isCom
                    ? curCom.range[0] - 1
                    : setNode[i + 1].range[0] - 1;
                }

                const sortedText = context
                  .getSourceCode()
                  .getText(sortImportNode);
                let newText = sortedText;
                if (newNode.isCom) {
                  newText = newNode.comment + '\n' + newText;
                }
                return [fixer.replaceTextRange(myRange, newText)];
              },
            });
          }
        });
      },
    };
  },
};
