/*
where are
Kyoto:260
Tokyo:130

service are
g1:ＮＨＫ総合１
g2:ＮＨＫ総合２
e1:ＮＨＫＥテレ１
e2:ＮＨＫＥテレ２
e3:ＮＨＫＥテレ３
e4:ＮＨＫワンセグ２
s1:ＮＨＫＢＳ１
s2:ＮＨＫＢＳ１(１０２ｃｈ)
s3:ＮＨＫＢＳプレミアム
s4:ＮＨＫＢＳプレミアム(１０４ｃｈ)
r1:ＮＨＫラジオ第1
r2:ＮＨＫラジオ第2
r3:ＮＨＫＦＭ
n1:ＮＨＫネットラジオ第1
n2:ＮＨＫネットラジオ第2
n3:ＮＨＫネットラジオＦＭ

genre are
0000:ニュース
0100:スポーツ
0205:情報・ワイドショー（グルメ）
0300:ドラマ（国内）
0409:音楽（童話）
0502:バラエティー（トークバラエティー）
0600:映画（洋画）
0700:アニメ
0800:ドキュメンタリー
0903:劇場・公演
1000:趣味
*/

function main() {
  var data = [];
  var where = '260'
  var service = ['g1','s1','s3'];
  var genre = ['0800','1000'];
  var date = get_date()//4日に一回、１週間はAPI側がもたない
  Logger.log(date);
  for(var i = 0; i < date.length; i++){
    for(var j = 0 ; j < genre.length; j++){
        for(var p = 0; p < service.length; p++){
          var res = NHK_API(where,service[p],genre[j],date[i])
          pushTwoDimensionalArray(data, res);
        }
//    Utilities.sleep(300);
    }
  }
  send_gmail(date[0],data);
//  Logger.log(data);
  
 //ニュースプログラム
  var data = [];
  var where = '260'
  var service = ['g1'];
  var genre = ['0000'];
  var date = get_date()//4日に一回、１週間はAPI側がもたない
  Logger.log(date);
  for(var i = 0; i < date.length; i++){
    for(var j = 0 ; j < genre.length; j++){
        for(var p = 0; p < service.length; p++){
          var res = NHK_API(where,service[p],genre[j],date[i])
          pushTwoDimensionalArray(data, res);
        }
//    Utilities.sleep(300);
    }
  }
  send_gmail(date[0],data);
//  Logger.log(data);
  
//ミナミプログラム
  var data = [];
  var where = '120'
  var service = ['g1','s1','s3'];
  var genre = ['0800','1000'];
  var date = get_date()//4日に一回、１週間はAPI側がもたない
  Logger.log(date);
  for(var i = 0; i < date.length; i++){
    for(var j = 0 ; j < genre.length; j++){
        for(var p = 0; p < service.length; p++){
          var res = NHK_API(where,service[p],genre[j],date[i])
          pushTwoDimensionalArray(data, res);
        }
//    Utilities.sleep(300);
    }
  }
  send_gmail2(date[0],data);
//  Logger.log(data);
}


function NHK_API(where,service,genre,date){
  var res2 = [];
  var add = ['id','start_time','area.name','service.name','title','subtitle','act','genres[0]'];
  var response = UrlFetchApp.fetch('http://api.nhk.or.jp/v2/pg/genre/'+where+'/'+service+'/'+genre+'/'+date+'.json?key=TO0ZZ6CuqpfI5rTr3mIZuTPAGwjAPlPa');
  var str_list = 'JSON.parse(response.getContentText()).list';
  if(eval(str_list)){  //null対策
    var str_service = str_list+'.'+service; //strで文字化（'.'がコードで置けないため一度strで置いてevalで変換）
    for(var i = 0; i < eval(str_service).length; i++){ 
      var res=[];
      for(var j = 0; j < add.length; j++){
        var res_comp_str = str_service +'['+i+'].'+ add[j];
        var res_data = eval(res_comp_str);
        res.push(res_data);
      }
      if(i===0){
        var res2 = res;
      }
      else{
        pushTwoDimensionalArray(res2, res);
      }
    }
    return res2;
  }
  else{
    return res2;
  }
}


function get_date(){
  var day = new Date();
  var date =[Utilities.formatDate(day, 'Asia/Tokyo', 'yyyy-MM-dd')];
  for(var i = 1;i < 1;i++){
    day.setDate(day.getDate() + 1);
    var day_format = Utilities.formatDate(day, 'Asia/Tokyo', 'yyyy-MM-dd');
    date.push(day_format);
  }

 return date;
}


function pushTwoDimensionalArray(array1, array2, axis){
  if(axis != 1) axis = 0;
  if(axis == 0){  //　縦方向の追加
    for(var i = 0; i < array2.length; i++){
      array1.push(array2[i]);
    }
  }
  else{  //　横方向の追加
    for(var i = 0; i < array1.length; i++){
      Array.prototype.push.apply(array1[i], array2[i]);
    }
  }
}
