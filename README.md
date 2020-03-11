# 【React Native】项目实战-Android天气app-原创-1

## 1 项目展示

<center><img src="https://github.com/dandanDQ/weather-react-native-android/blob/master/media/screen.PNG" width="50%"></center>
<center><strong>模拟器截图</strong></center>
<center><img src="https://github.com/dandanDQ/weather-react-native-android/blob/master/media/oppo_reno.png" width="50%"></center>
<center><strong>真机apk运行截图(机型：oppo reno)</strong></center>

### 1.1 功能介绍
自动定位到所在城市，获取当地天气信息，包括温度和天气描述等；中间一栏是五天天气预报（包括当天，主要是因为免费api只提供5天预报信息）；下边一栏是天气详情，包括体感温度、湿度、能见度、气压、风向和风速。

### 1.2 其他

代码架构和界面设计均为原创，转载请...随意。其中部分icon来自openWeather网站和阿里巴巴矢量图标库。


## 2 项目实现

### 2.1 获取地理位置

#### 获取定位权限

在定位之前，要做的第一件事是获取定位权限。
RN官方提供了PermissionsAndroid的API，用于相关权限的获取。

在低于Android 6.0的设备上，权限只要写在AndroidManifest.xml里就会自动获得，此情形下check会始终返回true和而request方法将始终解析为PermissionsAndroid.RESULTS.GRANTED。


而从Android 6.0（API级别23）开始，在必要时请求权限成为默认处理方式。

##### 使用ES7的async-await
在获取定位之前，使用弹窗请求用户权限

```
await requestCameraPermission();
```
requestCameraPermission()函数的实现
```
async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Get location permission',
        message:'Get location permission to fetch weather info.',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Got location permission');
    } else {
      console.log('Denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
```
#### 获取位置信息

react native 官方提供了Geolocation的API，但是该API需要谷歌框架的支持，在国内无法使用，在github上找到第三方库react-native-geolocation-service替代。

##### 安装

yarn
```
yarn add react-native-geolocation-service
```
npm
```
npm install react-native-geolocation-service
```

##### 使用Geolocation对象的getCurrentPosition方法获取位置信息
```
 Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
```
这里使用Geolocation对象的getCurrentPosition方法，传入两个函数。
第一个函数将在获取位置成功后调用，取得的结果作为参数传入该函数，可在该位置对位置信息进行处理，这里取出coods.latitude和coods.longitude存入state中。
第二个函数在获取位置失败后调用，这里输出错误信息。
这里类似于promise对象的then方法。

[插件链接](https://github.com/Agontuk/react-native-geolocation-service)



### 2.2 获取天气信息

#### fetch的使用细节

一个值得关注的问题是，fetch应该在组件的哪一个生命周期进行，首先排除render阶段，该函数只用于返回JSX，用于获取数据会改变state或者导致其他问题，那么componentWillMount和componentDidMount，选择哪一个？

##### **componentWillMount VS componentDidMount**
- **componentWillMount**
从逻辑上将，componentWillMount是一个合适的地方，但是它会导致很多问题出现。原因如下：
1.这个生命周期方法已经弃用
2.在第一次render之前，componentWillMount并不会返回数据，也就意味着会渲染至少一次空数据
3.该函数在render之前调用，但并不能阻塞render，会导致错误
- **componentDidMount**
正确的方式应该是使用componentDidMount,可以避免nd up with undefined state that causes errors悲剧的发生。

[参考文章](https://daveceddia.com/useeffect-hook-examples/)

##### 代码实现
具体使用代码如下(获取权限 > 获取定位 > etch天气数据)

```
  async componentDidMount() {
    await requestCameraPermission();
    if (true) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.fetchWeather(this.state.latitude, this.state.longitude);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});
    }
  }
```

#### 在openWeather网站上获取天气情况 

##### 在网站中注册并获取appid

appid填入地址栏appid一项作为查询信息

免费用户可获取的信息包括当前天气情况（current weather API）、五天间隔三小时天气预报（5 days/3 hour forecast API）、天气地图（weather maps 1.0）、紫外线指数（UV index）和天气预警（weather alert）。


##### 使用fetch查询天气数据

###### 查询格式
- 查询当前天气

```
http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}
```

- 查询天气预报

```
http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}
```

##### 返回信息格式和内容分析

###### 当前天气信息
```
{
    "base": "stations",
    "clouds": 
    { 
        "all": 1 
    },
    "cod": 200,
    "coord": {
        "lat": 37.42,
        "lon": -122.08
    },
    "dt": 1583819525,
    "id": 5375480,
    "main": {
        "feels_like": 283.38,
        "humidity": 66,
        "pressure": 1019,
        "temp": 285.14,
        "temp_max": 287.59,
        "temp_min": 282.59
    },
    "name": "Mountain View",
    "sys": {
        "country": "US",
        "id": 5903,
        "sunrise": 1583764046,
        "sunset": 1583806210,
        "type": 1
    },
    "timezone": -25200,
    "visibility": 16093,
    "weather": [{
        "description": "clear sky",
        "icon": "01n",
        "id": 800,
        "main": "Clear"
    }],
    "wind": {
        "deg": 56,
        "speed": 1.16
    }
}
```
在当前天气信息中，我们需要用到的数据及基本的处理如下：
- **主要信息**
地名 name 
国家 country
温度 main.temp
天气描述 weather.description
天气 weather.main
图标 weather.icon

- **次要信息**
体感温度 main.feels_like
湿度 main.humidity
日出时间 sunrise
日落时间 sunset
能见度 visibility
风等级 wind.deg


###### 天气预报信息

```
{
    "city": {
        "coord": {
            "lat": 33.9303,
            "lon": -118.2115
        },
        "country": "US",
        "id": 5369367,
        "name": "Lynwood",
        "population": 69772,
        "sunrise": 1583849356,
        "sunset": 1583891810,
        "timezone": -25200
    },
    "cnt": 40,
    "cod": "200",
    "list": [{
        "clouds": [Object],
        "dt": 1583895600,
        "dt_txt": "2020-03-11 03:00:00",
        "main": [Object],
        "rain": [Object],
        "sys": [Object],
        "weather": [Array],
        "wind": [Object]
    }, {
        "clouds": [Object],
        "dt": 1583906400,
        "dt_txt": "2020-03-11 06:00:00",
        "main": [Object],
        "rain": [Object],
        "sys": [Object],
        "weather": [Array],
        "wind": [Object]
    }...] 
```

在天气预报中，观察到预报内容包含五天的情况，每次间隔三小时 ，每一次的数据与当天预报格式是一致的。

##### 信息处理
- 温度的单位为开尔文，使用函数转化为摄氏度。
```
  TemTransfer(fah){
    var fahnum = parseFloat(fah);
    return (fahnum - 273.15).toFixed(0);
  }
```
- 风向单位为degree，转化为直观的风向

```
WindDirection(degree){
    if (degree>337.5) return 'Northerly';
    if (degree>292.5) return 'North Westerly';
    if(degree>247.5) return 'Westerly';
    if(degree>202.5) return 'South Westerly';
    if(degree>157.5) return 'Southerly';
    if(degree>122.5) return 'South Easterly';
    if(degree>67.5) return 'Easterly';
    if(degree>22.5){return 'North Easterly';}
    return 'Northerly';
```


- 关于**天气图标**

**图标信息**
点击[原网址](https://openweathermap.org/weather-conditions)查看图标信息。


**动态加载图片**
由于图标的uri是动态的，此处涉及到动态加载图片的问题。
查询的天气结果会返回一个icon的名称，存放于weather.icon中，作为一个变量，怎么使用require取获取图片？
一开始我尝试了直接require(variable)的方式，但显然这是不可行的，因为require中只能有纯字符串，网上看到require('../icons/'+variable+'.png')的方式，但也不能使用。

![](https://github.com/dandanDQ/weather-react-native-android/blob/master/media/error3.PNG)

最后我将每一个require实现作为一个case，传入指定的icon名字，返回对应的require结果。

获取icon的函数实现
```
export const getIcon = icon => {
    switch (icon) {
        case "01d":
            return require("../icons/01d.png");
        case "01n":
            return require("../icons/01n.png");
    }
}
```

使用
```
import {getIcon} from './icons';
<Image style={styles.positionImage} source={require('../icons/position.png')}/>
```

### 2.3 界面设计与组件使用

#### 数据获取与渲染问题

第一次进入到页面的时候，因为需要去fetch数据，所以会在没数据的情况下有一次渲染，等fetch成功后，会再一次进行渲染。

这样会导致出错。一个比较好的解决方法是，使用变量来标识数据获取是否完成，并以此为依据决定是否渲染页面。

在state中定义变量isLoading，true表示正在加载

```
constructor(props){
    super(props);
    this.state = {
      isLoading:true,
    }
}
```

当数据fetch结束并完成setState后，设置isLoading为否
```
this.setState({
            isLoading:false,
});
```
在渲染处，由isLoading的值决定渲染哪一个页面

```
  render() {
    return (
      this.state.isLoading?
        <View><Text>加载中....</Text></View>:
        <View><Text>天气预报页面</Text><View>
    )}
```

## 3 导出为Android安装包

[官方教程](https://reactnative.cn/docs/removing-default-permissions/) 

- 生成签名密钥

```
$ keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

- 将my-release-key.keystore放到android/app下
- 编辑~/.gradle/gradle.properties,******换为刚刚设置的密码
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```
- 编辑android/app/build.gradle，注意是app目录下的
...表示省略的部分
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```
- 生成apk包
在android目录下运行
```
./gradlew assembleRelease
```
生成的 APK 文件位于android/app/build/outputs/apk/release/app-release.apk

- 连接网络问题

找到 \android\app\src\main\AndroidManifest.xml文件
添加 android:usesCleartextTraffic="true" 

指示应用程序是否打算使用明文网络流量，例如明文HTTP。目标API级别为27或更低的应用程序的默认值为“ true”。面向API级别28或更高级别的应用默认为“ false”

## 4 源码地址

- [apk下载](https://download.csdn.net/download/jiangyaoyujian/12242038)

- 源码

```
npx react-native init mypro
yarn android
```

## 5 后续改进

- [ ] **动画**
[RN-motion](https://github.com/xotahal/react-native-motion) 这个动画相当酷炫，后续我会在项目中加上动画相关实现，还可以参考codepen上一些大神的动画作品~
另外“加载中”页面也可以使用一些好玩的动画

- [ ] **加入以3小时为间隔的天气预报chart**
大概是这样子的：
![](./chart.png)
滑动细节栏就可以查看chart。
立个小flag，一周内更新到github上并将实现过程中遇到的问题记录到博客里。

- [ ] 允许用户添加城市
需要有地图接口，获取指定city的名称信息
- [ ] app的logo
- [x] 温度排序的问题:遍历查找
- [x] 组件摆放问题
- [x] 压缩安装包的大小！！！
- [ ] 加载页面的动画
- [ ] 加入交互设计，点击详细信息会发声，有动画等
- [ ] 更多皮肤？

