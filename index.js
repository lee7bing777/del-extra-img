#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

function initConfig() {
    var curConfig = {};
    var argv = process.argv;
    for (var i = 0; i < argv.length; i++) {
        var arr = String(argv[i]).split('=');
        if (arr.length === 2) {
            curConfig[arr[0]] = arr[1]
        }
    }
    return curConfig;
}

function readFileList(_path, list, basePath) {
    try {
        var baseUrl = basePath || _path;
        var files = fs.readdirSync(_path);
        files.map(item => {
            var stat = fs.statSync(path.join(_path, item));
            if (stat.isDirectory()) {
                readFileList(path.join(_path, item), list, baseUrl);
            } else {
                var curItem = item.split('.');
                var gap = !!basePath ? '/' : '';
                list.push(_path.substring(baseUrl.length + 1) + gap + curItem[0] + '.' + String(curItem.length > 2 ? curItem[2] : curItem[1]));
            }
        })
    } catch (error) {
        console.log(error, 'error...readFileList......');
    }
}

function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, _, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}

function delImg(arr) {
    if (arr.length === 0) {
        console.log('没有重复的图片......');
        return;
    }
    arr.map(ele => {
        try {
            fs.unlinkSync(path.join(delPath + '\\' + ele));
        } catch (error) {
            console.log(error, 'fs.unlinkSync...error......');
        }
    })
}

function delNullFiles(_path) {
    try {
        var files = fs.readdirSync(_path);
        files.map(item => {
            var stat = fs.statSync(path.join(_path, item));
            if (stat.isDirectory()) {
                var file = fs.readdirSync(path.join(_path, item));
                if (file.length === 0) {
                    fs.rmdirSync(path.join(_path, item));
                }
            }k
        })
    } catch (error) {
        console.log(error, 'error...delNullFiles......');
    }

}

var cwd = process.cwd();
var config = initConfig();

var baseList = [];
var delPathList = [];

var basePath = path.join(cwd, config.path);
var delPath = path.join(cwd, config.delPath);


if (!fs.existsSync(basePath) || !fs.existsSync(delPath)) {
    console.log('err...config......');
    return;
}

readFileList(basePath, baseList);
readFileList(delPath, delPathList);

var delArr = getArrDifference(baseList, delPathList);
delImg(delArr);
delNullFiles(delPath);
console.log('success......');









