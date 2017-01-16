function getReceipt(id) {
    id = id.replace(/\*/g, ' ');

    var alef = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10,k:11,l:12,m:13,
                n:14,o:15,p:16,q:17,r:18,s:19,t:20,u:21,v:22,w:23,x:24,y:25,z:26};
    var ts = Date.now().toString();
    var receipt = ts + '*';

    for (var i = 0; i < id.length; i++) {
        var letter = alef[id[i].toLowerCase()] || 0;
        receipt += letter + '*';

    }
    receipt += ts.split('').reverse().join().replace(/,/g, '');
    return receipt;
}

function decodeReceipt(id) {
    var alef = '-abcdefghijklmnopqrstuvwxyz'.split('');

    var receipt = id.split('*');
    var decoded = '';

    for (var i = 0; i < receipt.length; i++) {
        if (i > 0 && i < receipt.length - 1) {
            decoded += alef[receipt[i]];
        }
    }

    return decoded;
}
