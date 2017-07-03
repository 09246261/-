// 引入 gulp 摸快
var gulp = require('gulp');
//引入 sass 摸快 预编译
var less = require('gulp-less');
var sass = require('gulp-sass');
//链接服务器
var connect = require('gulp-connect');
//合并
var concat = require('gulp-concat');
//js 文件压缩
var uglify = require('gulp-uglify');
//重命名
var rename = require('gulp-rename');
//css压缩
var minifyCSS = require('gulp-minify-css');
//图片压缩 window下不好用
var imagemin = require('gulp-imagemin');
//css 后编译 处理兼容问题
var postcss = require('gulp-postcss');
//css 属性前缀
var autoprefixer = require('autoprefixer');
//文件合并
var contentIncluder = require('gulp-content-includer');
var runSequence = require('gulp-run-sequence');

var path = {
	"src" : {
		"ueditor":
		[
		   "ueditor/**"
		],
		"font" : [
			"font/**.css",
			"font/**.eot",
			"font/**.js",
			"font/**.woff",
			"font/**"
		],
		"css" : [
		    "css/**",
			"css/**.scss",
			"css/**.less",
			"css/**.css"
			
		],
		"js" : [
		     "js/**",
			 "js/*.js"
		],
		"html":[
			"html/*.html"
		],
		"images":[
			"./img/**.jpg",
			"./img/**.png",
			"./img/**.jpeg",
			"./img/**.gif"

		],
		"data" : [
			"data/*.json" 
		]
	},
	"dest" : "dist/"
}

//js文件的转换
gulp.task('scripts', function(){
  return gulp.src(path.src.js)
    //.pipe(concat('zepto-all.js'))
    //.pipe(uglify())
    .pipe(gulp.dest( path.dest + 'js'))
    .pipe(connect.reload());
});

gulp.task('ueditor', function(){
  return gulp.src(path.src.ueditor) 
    .pipe(gulp.dest( path.dest + 'ueditor'))
    .pipe(connect.reload());
});

//起服务
gulp.task('server', function(){
  connect.server({
    root: path.dest,
    livereload: true,
    //修改端口号
    port:8090
  });
});
//html 
gulp.task('html', function(){
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dest+"html"))
    .pipe(connect.reload());
});
gulp.task('copy-index', function(){
  return gulp.src('./index.html')
    .pipe(gulp.dest(path.dest))
    .pipe(connect.reload());
});
//font 
gulp.task('font', function(){
  return gulp.src(path.src.font)
    .pipe(gulp.dest(path.dest+"font")) 
});
//img
gulp.task('images', function(){
  return gulp.src(path.src.images)
    // .pipe(imagemin())
    .pipe(gulp.dest(path.dest + "img"));
});
//json
gulp.task('data', function(){
  return gulp.src(path.src.data)
  		.pipe(gulp.dest(path.dest + 'data'));
});
//sass
gulp.task('sass', function(){
  return gulp.src(path.src.css[0])
    .pipe(sass())
	 	.pipe(postcss([autoprefixer]))
		 .pipe(minifyCSS())
    .pipe(gulp.dest(path.dest + "css"))
    .pipe(gulp.dest("./css"))
		.pipe(connect.reload());
});
//less
gulp.task('less', function(){
  return gulp.src(path.src.css[1])
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.dest + "css"));
});
//css
gulp.task('css', function(){
  return gulp.src(path.src.css[2])
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.dest + "css"))
		.pipe(connect.reload());
});
//build
gulp.task('build', ['copy-index', 'images', 'scripts', 'sass', 'css','data','html','font','ueditor'], function(){
  //runSequence('concat');
  console.log('编译成功！');
});
//watch
gulp.task('watch', function(){ 
  gulp.watch('./index.html', ['copy-index']);
  gulp.watch(path.src.html, ['html']);
  gulp.watch(path.src.ueditor, ['ueditor']);
  gulp.watch(path.src.font, ['font']);
  gulp.watch(path.src.images, ['images']);
  gulp.watch(path.src.data, ['data']);
  gulp.watch(path.src.js, ['scripts']);
  gulp.watch(path.src.css[0], ['sass']);
  gulp.watch(path.src.css[2], ['css']);
});

gulp.task('default', ['server', 'watch']);

//gulp.task('concat',function() {
   // gulp.src("dist/*.html")
     //   .pipe(contentIncluder({
      //      includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
      //  }))
       // .pipe(gulp.dest('dist/'));
//});


// end
