// ERA

const TYPES = {
	GENESIS_TRANSACTION: 1,
	PAYMENT_TRANSACTION: 2,
	REGISTER_NAME_TRANSACTION: 3,
	UPDATE_NAME_TRANSACTION: 4,
	SELL_NAME_TRANSACTION: 5,
	CANCEL_SELL_NAME_TRANSACTION: 6,
	BUY_NAME_TRANSACTION: 7,
	CREATE_POLL_TRANSACTION: 8,
	VOTE_ON_POLL_TRANSACTION: 9,
	ARBITRARY_TRANSACTION: 10,
	ISSUE_ASSET_TRANSACTION: 11,
	TRANSFER_ASSET_TRANSACTION: 12,
	CREATE_ORDER_TRANSACTION: 13,
	CANCEL_ORDER_TRANSACTION: 14,
	MULTI_PAYMENT_TRANSACTION: 15,
	DEPLOY_AT_TRANSACTION: 16,
	MESSAGE_TRANSACTION: 17
};


// ISSUE_ASSET_TRANSACTION = 21;		++++++++++++++++++++++++++
// ISSUE_IMPRINT_TRANSACTION = 22;
// ISSUE_NOTE_TRANSACTION = 23;
// ISSUE_PERSON_TRANSACTION = 24;		+++++++++++++++++++++++++++
// ISSUE_STATUS_TRANSACTION = 25;		+++++++++++++++++++++++++++
// ISSUE_UNION_TRANSACTION = 26;
// ISSUE_STATEMENT_TRANSACTION = 27; // not in gui

	// SEND ASSET
// SEND_ASSET_TRANSACTION = 31;			+++++++++++++++++++++++++++
	// RENT ASSET
// RENT_ASSET_TRANSACTION = 32; //
	// HOLD ASSET
// HOLD_ASSET_TRANSACTION = 33; // not in gui
	
	// OTHER
// SIGN_NOTE2_TRANSACTION = 34;
// SIGN_NOTE_TRANSACTION = 35;
// CERTIFY_PUB_KEYS_TRANSACTION = 36;	++++++++++++++++++++++++++++++
// SET_STATUS_TO_ITEM_TRANSACTION = 37;	++++++++++++++++++++++++++++++
// SET_UNION_TO_ITEM_TRANSACTION = 38;
// SET_UNION_STATUS_TO_ITEM_TRANSACTION = 39; // not in gui
	
	// confirms other transactions
	// NOT EDIT - fkr CONCORCIUM = 40 !!!
// VOUCH_TRANSACTION = 40;				+++++++++++++++++++++++++++++
// HASHES_RECORD = 41;
	
	// exchange of assets
// CREATE_ORDER_TRANSACTION = 50;		+++++++++++++++++++++++++++++
// CANCEL_ORDER_TRANSACTION = 51;		+++++++++++++++++++++++++++++
	// voting
// CREATE_POLL_TRANSACTION = 61;
// VOTE_ON_POLL_TRANSACTION = 62;

function getKeyPairFromSeed(seed, returnBase58)
{
	if(typeof(seed) == "string") {
		seed = new Uint8Array(Base58.decode(seed));
	}
	
	var keyPair = nacl.sign.keyPair.fromSeed(seed);
	
	var base58privateKey = Base58.encode(keyPair.secretKey);
	var base58publicKey = Base58.encode(keyPair.publicKey);
	if(returnBase58) {
		return {
			privateKey: Base58.encode(keyPair.secretKey),
			publicKey: Base58.encode(keyPair.publicKey)
		};
	} else {
		return {
			privateKey: keyPair.secretKey,
			publicKey: keyPair.publicKey
		};
	}
}

function stringtoUTF8Array(message) {
	if (typeof message == 'string') {
	   var s =  unescape(encodeURIComponent(message)); // UTF-8
		message = new Uint8Array(s.length);
		for (var i = 0; i < s.length; i++) {
			message[i] = s.charCodeAt(i) & 0xff;
		}
	}
	return message;
}

function floatTo32Byte(data){
	var farr = new Float32Array(1);  // two indexes each 4 bytes
	farr[0] = data;
	var buff = new Int8Array(farr.buffer);
	var out = [];
	var k = 3;
	for (var i = 0; i < 4; i++){
	out.push(buff[k]);
	k--;
	}
	return out;
}

function int32ToBytes (word) {
	var byteArray = [];
	for (var b = 0; b < 32; b += 8) {
		byteArray.push((word >>> (24 - b % 32)) & 0xFF);
	}
	return byteArray;
}

function toFloat32(value) {
    var bytes = 0;
    switch (value) {
        case Number.POSITIVE_INFINITY: bytes = 0x7F800000; break;
        case Number.NEGATIVE_INFINITY: bytes = 0xFF800000; break;
        case +0.0: bytes = 0x40000000; break;
        case -0.0: bytes = 0xC0000000; break;
        default:
            if (Number.isNaN(value)) { bytes = 0x7FC00000; break; }

            if (value <= -0.0) {
                bytes = 0x80000000;
                value = -value;
            }
            var exponent = Math.floor(Math.log(value) / Math.log(2));
            var significand = ((value / Math.pow(2, exponent)) * 0x00800000) | 0;
            exponent += 127;
            if (exponent >= 0xFF) {
                exponent = 0xFF;
                significand = 0;
            } else if (exponent < 0) exponent = 0;

            bytes = bytes | (exponent << 23);
            bytes = bytes | (significand & ~(-1 << 23));
        break;
    }
    return bytes;
};


function int64ToBytes (int64) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = int64 & 0xff;
        byteArray [ byteArray.length - index - 1 ] = byte;
        int64 = (int64 - byte) / 256 ;
    }
    return byteArray;
}

function appendBuffer (buffer1, buffer2) {
	buffer1 = new Uint8Array(buffer1);
	buffer2 = new Uint8Array(buffer2);
	var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(buffer1, 0);
	tmp.set(buffer2, buffer1.byteLength);
	return tmp;
}

function equal (buf1, buf2)
{
    if (buf1.byteLength != buf2.byteLength) return false;
    var dv1 = new Uint8Array(buf1);
    var dv2 = new Uint8Array(buf2);
    for (var i = 0; i != buf1.byteLength; i++) {
        if (dv1[i] != dv2[i]) return false;
    }
    return true;
}

function generateAccountSeed(seed, nonce, returnBase58) {
	if(typeof(seed) == "string") {
		seed = Base58.decode(seed);
	}
	nonceBytes = int32ToBytes(nonce);
	var resultSeed = new Uint8Array();
	resultSeed = appendBuffer(resultSeed, nonceBytes);
	resultSeed = appendBuffer(resultSeed, seed);
	resultSeed = appendBuffer(resultSeed, nonceBytes);
	if (returnBase58) {
		return Base58.encode(SHA256.digest(SHA256.digest(resultSeed)));
	} else {
		return new SHA256.digest(SHA256.digest(resultSeed));
	}
}

function getAccountAddressFromPublicKey(publicKey) {
	let ADDRESS_VERSION = 15; 
	if (typeof(publicKey) == "string") {
		publicKey = Base58.decode(publicKey);
	}
	let publicKeyHashSHA256 = SHA256.digest(publicKey);
	let ripemd160 = new RIPEMD160();
	let publicKeyHash = ripemd160.digest(publicKeyHashSHA256);
	let addressArray = new Uint8Array();
	addressArray = appendBuffer(addressArray, [ADDRESS_VERSION]);
	addressArray = appendBuffer(addressArray, publicKeyHash);
	let checkSum = SHA256.digest(SHA256.digest(addressArray));
	addressArray = appendBuffer(addressArray, checkSum.subarray(0, 4));
	return Base58.encode(addressArray);
}

function getAccountAddressType(address) {
	try {
		var ADDRESS_VERSION = 15;  // Q
		var AT_ADDRESS_VERSION = 23; // A
		if(typeof(address) == "string") {
			address = Base58.decode(address);
		}
		var checkSum = address.subarray(address.length - 4, address.length)
		var addressWitoutChecksum = address.subarray(0, address.length - 4);
		var checkSumTwo = SHA256.digest(SHA256.digest(addressWitoutChecksum));
		checkSumTwo = checkSumTwo.subarray(0, 4);
		if (equal(checkSum, checkSumTwo))
		{
			if(address[0] == ADDRESS_VERSION)
			{
				return "standard";
			}
			if(address[0] == AT_ADDRESS_VERSION)
			{
				return "at";
			}
		}
		return "invalid";
	} catch (e) {
		return "invalid";
	}
}

function isValidAddress(address) 
{
	return (getAccountAddressType(address) != "invalid");
}

function generateSignaturePaymentTransaction(keyPair, lastReference, recipient, amount, fee, timestamp) {
	const data = generatePaymentTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp);
	return nacl.sign.detached(data, keyPair.privateKey);
}

function generatePaymentTransaction(keyPair, lastReference, recipient, amount, fee, timestamp, signature) {
	return appendBuffer(generatePaymentTransactionBase(keyPair.publicKey, lastReference, recipient, amount, fee, timestamp),
		signature);
}

function generatePaymentTransactionBase(publicKey, lastReference, recipient, amount, fee, timestamp) {
	const txType = TYPES.PAYMENT_TRANSACTION;
	const typeBytes = int32ToBytes(txType);
	const timestampBytes = int64ToBytes(timestamp);
	const amountBytes = int64ToBytes(amount * 100000000);
	const feeBytes = int64ToBytes(fee * 100000000);
	var data = new Uint8Array();
	data = appendBuffer(data, typeBytes);
	data = appendBuffer(data, timestampBytes);
	data = appendBuffer(data, lastReference);
	data = appendBuffer(data, publicKey);
	data = appendBuffer(data, recipient);
	data = appendBuffer(data, amountBytes);
	data = appendBuffer(data, feeBytes);
	return data;
}

// send asset transaction
// keyPair 		- pair public key + security key (byte64, byte32)
// recipient	- recipient (byte[25])
// asset_key	- asset Key (Long)
// amount		- Ammount    (Float); null
// timestamp	- Unix timestamp (Long). 1514529622881
// title		- Title (String)
// message		- Message (String); null
// enscript		- 0 not enscript; 1 enscript
// is_text		- 1
// port 		- ERA network PORT 9046 or dev:9066 (int)
// generate_R_Send_TransactionBase(keyPair, recipient, 1, 10.000001, 1514529622881, "Title", "Message", 0, 1, 9066)
// return byte[]
function generate_R_Send_TransactionBase( keyPair, recipient, asset_key, amount, timestamp, title, message, enscript, is_text, port) {
	// type transaction
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data1 = new Uint8Array();
	data1 = appendBuffer(data1, recipient);
	var  am = 128;
	if (amount != 0 && amount != null)	{
		// amount  10.20 * 100000000
		am = 0;
		if ( amount == null || amount == "" ) {
			amount = 0;
		}
		// Asset key
		if ( asset_key == null || asset_key == "" ) {
			asset_key = 0;
		}
		data1 = appendBuffer(data1, int64ToBytes(asset_key));
		data1 = appendBuffer(data1, int64ToBytes(parseFloat(amount) * 100000000));
	}
	// Title 
	var arr = toUTF8Array(title);
	data1 = appendBuffer(data1, [arr.length]);
	data1 = appendBuffer(data1, arr);
	// Message
	mes = 128;
	if (message != null && message != "") {
		arr = toUTF8Array(message);
		data1 = appendBuffer(data1, int32ToBytes(arr.length));
		data1 = appendBuffer(data1, arr);
		data1 = appendBuffer(data1, enscript);
		data1 = appendBuffer(data1, is_text);
		mes = 0; // with amount
	}
	var typeBytes = [31,0,am,mes]; // with amount
	var data0 = new Uint8Array();
	data0 = tobyteBasePart(typeBytes, int64ToBytes(timestamp), lastReferenceByte, keyPair.publicKey, fee_c);
	let raw = toByteEndPart(data0, data1, keyPair.privateKey, port );
	return raw;
}

function tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, publicKey, fee_c) {
	var data = new Uint8Array();
	// sign data
	data = appendBuffer(data, typeBytes);
	data = appendBuffer(data, timestampBytes);
	data = appendBuffer(data, lastReferenceByte);
	data = appendBuffer(data, publicKey);
	data = appendBuffer(data, fee_c);
	return data;
}

function getSignEndPart(data0, data1, privateKey, port ) {
	var data = new Uint8Array();
	data = appendBuffer(data, data0);
	data = appendBuffer(data, data1);
	data = appendBuffer(data, int32ToBytes(port));
	var signature = nacl.sign.detached(data, privateKey);
	return Base58.encode(signature);
}

function toByteEndPart(data0, data1, privateKey, port ) {
	var data = new Uint8Array();
	data = appendBuffer(data, data0);
	data = appendBuffer(data, data1);
	data = appendBuffer(data, int32ToBytes(port));
	var signature = nacl.sign.detached(data, privateKey);
	if (signature.length != 64) {
		alert("Signature is incorrect.");
		return;
	}
	var sss = Base58.encode(signature);
	// raw teransaction R_Send
    data = null;	
	data = appendBuffer(data, data0);
	data = appendBuffer(data, signature);
	data = appendBuffer(data, data1);
	return data;
}

function toByteItemPart(item_Type, owner, name, icon, image, description ) {
	var data = new Uint8Array();
	data = appendBuffer(data, item_Type); 					//type asset 2 bytes
	data = appendBuffer(data, owner); 						// owner address
	var arr = toUTF8Array(name);
	data = appendBuffer(data, [arr.length]); 				// asset name lenght
	//console.log("name length:" + [arr.length]);
	data = appendBuffer(data, arr );			// asset name
	aa = int32ToBytes(icon.length);
	data = appendBuffer(data, [aa[2],aa[3]]);						// icon length 2 bytes
	data = appendBuffer(data, icon);
	data = appendBuffer(data, int32ToBytes(image.length));		// image length
	data = appendBuffer(data, image);								// image
	arr = toUTF8Array(description);
	data = appendBuffer(data, int32ToBytes(arr.length)); 	// asset name lenght
	data = appendBuffer(data, arr);			// asset name
	return data;
}

// keyPair 		- pair public key + security key (byte64, byte32)
// timestamp	- Unix timestamp (Long). 1514529622881
// asset_name	- Asset name (String)
// icon			- Icon (byte[])
// image		- Image (byte[])
// description	- Description (String)
// quantity		- QTY (Long)
// scale		- scale (int)
// divasible	- Divisible (0 - not divisible, 1 - divisible)
// movable  - Movable (0 - not movable, 1- movable)
// port 		- ERA network PORT 9046 or dev:9066 (int)			
// (это я дописал не было) movable      - Movable (0 - not movable, 1 - movable)
// issue_Asset(keyPair, 1514529622881, "Asset asset develop", byte[], byte[], "description", 1000, 2, 0, 1, 9046, 0)
// return byte[]
function issue_Asset(keyPair, timestamp, asset_name, icon, image, description, quantity, scale, divasible, movable, port){
// type transaction
	const typeBytes = [21,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	
	var data1 = new Uint8Array();
	// item part
	data1 = appendBuffer(data1, toByteItemPart([2,movable], keyPair.publicKey, asset_name, icon, image, description )); // item part
	// asset part
	data1 = appendBuffer(data1, int64ToBytes(quantity));			// Quantity
	data1 = appendBuffer(data1, [scale]);							// Scale 1 byte
	data1 = appendBuffer(data1, [divasible]);						// divasible 1 byte
	// end part
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// Issue Person Transaction
// keyPair 			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// data				- Persondata
// port				- ERA network PORT 9046 or dev:9066 (int)
// issue_Person_Transaction(keyPair, 1514529622881, byte[], 9046)
// return byte[]
function issue_Person_Transaction(keyPair, timestamp, data, port){
	// type transaction
	const typeBytes = [24,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	return toByteEndPart(data0, data, keyPair.privateKey, port );
}

// create Persondata
// keyPair 			- pair public key + security key (byte64, byte32)
// name				- name (String)
// icon				- Icon (byte[])
// image			- Image (byte[])
// description		- Description (String)
// birthday			- birthday. Unix timestamp (Long). 1514529622881
// deathday			- deathday. Unix timestamp (Long). 1514529622881
// gender			- gender. (0 - male, 1- female)
// race				- rase. (String)
// birthLatitude	- birthLatitude (float)
// birthLongitude	- birthLongitude (float)
// skinColor		- skin color (String)
// eyeColor			- eye color (Streng)
// hairColor		- hair color (String)
// height			- height (int) 
// toBytePerson(keyPair, "Person Name", byte[], byte[], "Person description", 1514529622881, 1514529622881, 0, "white", 31.2, 141.2, "white", "broun", "broun", 180)
// return byte[]
function toBytePerson(keyPair, name, icon, image, description, birthday, deathday, gender, race, birthLatitude, birthLongitude, skinColor, eyeColor, hairColor, height){
	// type transaction
	// to byte Person info
	var data = new Uint8Array();
	var dataAppend = new Uint8Array();
	var signData = new Uint8Array();
	// item part
	data = appendBuffer(data, toByteItemPart([1,1], keyPair.publicKey, name, icon, image, description )); // item part
	signData = appendBuffer(signData, toUTF8Array(name)); 
	signData = appendBuffer(signData, image);				
	signData = appendBuffer(signData, toUTF8Array(description));	
	// person part
	dataAppend = appendBuffer(dataAppend, int64ToBytes(birthday));			// birthday 8
	dataAppend = appendBuffer(dataAppend, int64ToBytes(deathday));			// deathday	BYTE[8]	Long	
	dataAppend = appendBuffer(dataAppend, [gender]);						// Gender	BYTE[1]	int
	var arr = toUTF8Array(race);
	dataAppend = appendBuffer(dataAppend, [arr.length]);					//raceLength	BYTE[1]	int
	dataAppend = appendBuffer(dataAppend, arr);								//race 	BYTE[raceLength]	String
	var dd = floatTo32Byte(birthLatitude);
	dataAppend = appendBuffer(dataAppend, floatTo32Byte(birthLatitude));	// birthLatitude	BYTE[4]	float
	dataAppend = appendBuffer(dataAppend, floatTo32Byte(birthLongitude));	// birthLongitude	BYTE[4]	float
	arr =  toUTF8Array(skinColor);
	dataAppend = appendBuffer(dataAppend, [arr.length]);					//skinColorLength	BYTE[1]	int
	dataAppend = appendBuffer(dataAppend, arr);								//skinColor	BYTE[skinColorLength]	string
	arr = toUTF8Array(eyeColor);
	dataAppend = appendBuffer(dataAppend, [arr.length]);					//eyeColorLength	BYTE[1]	int
	dataAppend = appendBuffer(dataAppend,  arr);							// eyeColorBytes	BYTE[eyeColorLength]	string
	arr = toUTF8Array(hairColor);	
	dataAppend = appendBuffer(dataAppend, [arr.length]);					//hair�olorLength	BYTE[1]	int
	dataAppend = appendBuffer(dataAppend, arr);								//hair�olorBytes	BYTE[hair�olorLength]	string
	dataAppend = appendBuffer(dataAppend, [height]);						//Height	BYTE[1]	int
	signData = appendBuffer(signData, dataAppend)
	var signature = nacl.sign.detached(signData, keyPair.privateKey); 		// ownerSignature	BYTE[64]	BYTE[]
	data = appendBuffer(data, dataAppend);
	data = appendBuffer(data, signature);
	return data;
}

function  byteToNum(/*byte[]*/byteArray) {
    var value = 0;
    for ( var i = 0; i< byteArray.length; i++) {
        value = (value * 256) + byteArray[i];
    }
    return value;
};

function bytesToFloat32(/*byte[4]*/byte) {
	if ( byte.length == 4 ) {
		var bytesArray = new DataView(new Uint8Array(byte).buffer);
		return bytesArray.getFloat32(0).toFixed(5);
	} else {return 0;}
}

function bytesToString(bytes) {
	var binaryString = '',
		length = bytes.length;
	for (var i = 0; i < length; i++) {
	  binaryString += String.fromCharCode(bytes[i]);
	}
	return binaryString;
}

// parse raw - base58.encode(PERSON_DATA!!!)
//function byteToPersonRemade(raw){
//	if (raw.length == 0) {
//		alert("Byte code cannot be zero length.");
//		return;
//	}
//	var position = 0;	
//	var data = Base58.decode(raw);
	//console.log("data:" + data);
	// type 
//	var type = (data.slice(position,position + 2));
//	console.log("type:"+type);
//	position = position + 2;
	// sender account
//	var senderAccount = (data.slice(position,position + 32));
//	console.log("senderAccount:" + senderAccount + "; uncode:" + Base58.encode(senderAccount));
//	position = position + 32;
//	var ss = [0,data[position]];
//	var nameLegt = byteToNum(ss);
//	console.log("name length:" + ss + "; uncode:" + nameLegt);
//	position = position + 1;
	// name
//	if (isIE()) {
//		alert("Person parsing is not supported for Internet Explorer ");
//	}
//	if (isEDGE()) {
//		alert("Person parsing is not supported for EDGE.");
//	}
//	var personName = new TextDecoder('UTF-8').decode(data.slice(position,position + nameLegt));
//	console.log("person name:" + data.slice(position,position + nameLegt) + "; uncode:" + personName);
//	position = position + nameLegt;
//	var iconLeght = byteToNum(data.slice(position,position + 2));
//	console.log("icon length:" + data.slice(position,position + 2) + "; uncode:" + iconLeght);
//	position = position + 2;
	// icon
//	var icon = data.slice(position, position + iconLeght);
//	console.log("icon:" + icon);
//	position = position + iconLeght;
//	var imageLeght = byteToNum(data.slice(position, position + 4));
//	console.log("image length:" + data.slice(position, position + 4) + "; decode:" + imageLeght);
//	position = position + 4;
	// image
//	var image = data.slice(position, position + imageLeght);
//	position = position + imageLeght;
//	var descriptionLeght = byteToNum(data.slice(position, position + 4));
//	console.log("description length:" + data.slice(position, position + 4) + "; decode:" + descriptionLeght);
//	position = position + 4;
	// descriprion
//	var description = new TextDecoder('UTF-8').decode(data.slice(position, position+ descriptionLeght));
//	console.log("description:" + data.slice(position, position+ descriptionLeght) + "; decode:" + description);	
//	position = position + descriptionLeght;
	// birthday
//	var birthday = byteToNum(data.slice(position, position + 8));
//	console.log("birthday:" + data.slice(position, position + 8) + "; decode:" + birthday);	
//	position = position+8;
	// deathday
//	var deathday  = byteToNum(data.slice(position, position + 8));
//	console.log("deathday:" + data.slice(position, position + 8) + "; decode:" + deathday);	
//	position = position + 8;
	// gender
//	var gender = byteToNum(data.slice(position, position + 1));
//	console.log("gender:" + data.slice(position, position + 1) + "; decode:" + gender);	
//	position = position +1; 
//	var raceLength = byteToNum(data.slice(position, position + 1));
//	console.log("race length:" + data.slice(position, position + 1) + "; decode:" + raceLength);	
//	position = position +1; 
	// race
//	var race = new TextDecoder('UTF-8').decode(data.slice(position, position+raceLength));
//	position = position + raceLength;
	//READ BIRTH LATITUDE
//	var birthLatitude = bytesToFloat32(data.slice(position, position + 4));
//	position = position + 4;
	//READ BIRTH LONGITUDE
//	var birthLongitude =  bytesToFloat32(data.slice(position, position + 4));
//	position = position + 4;
	//READ SKIN COLOR LENGTH
//	var skinColorLength = byteToNum(data.slice(position, position + 1));
//	position = position + 1;
//	var skinColor = new TextDecoder('UTF-8').decode(data.slice(position, position + skinColorLength));
//	position = position + skinColorLength;
	//READ EYE COLOR LENGTH
//	var eyeColorLength = byteToNum(data.slice(position, position+1));
//	position = position + 1;
//	var eyeColor = new TextDecoder('UTF-8').decode(data.slice(position, position + eyeColorLength));
//	position = position + eyeColorLength;
	//READ HAIR COLOR LENGTH
//	var hairColorLength = byteToNum(data.slice(position, position+1));
//	position = position + 1;
//	var  hairColor = new TextDecoder('UTF-8').decode(data.slice(position, position + hairColorLength));
//	position = position + hairColorLength;
	//READ HEIGHT
//	var height = byteToNum(data.slice(position, position+1));
//	position = position + 1;
//	var ownerSignature;
//	if (type[1] == 1)	{
		// with signature
		//READ SIGNATURE
//		ownerSignature = data.slice(position, position + 64);
//		position = position + 64;
//	} else {
//		ownerSignature = [];
//	}
			
//	var person = new Number();
//	person["type"] = type;
//	person["senderAccount"] = senderAccount; 		
//	person["personName"] = personName;
//	person["icon"] = icon;
//	person["image"] = image;
//	person["description"] = description;
//	person["birthday"] = birthday;
//	person["deathday"] = deathday;
//	person["gender"] = gender;
//	person["race"] = race;
//	person["birthLatitude"] = birthLatitude;
//	person["birthLongitude"] = birthLongitude;
//	person["skinColor"] = skinColor;
//	person["eyeColor"] = eyeColor;
//	person["hairColor"] = hairColor;
//	person["height"] = height;
//	person["ownerSignature"] = ownerSignature;
//	return person;
			
//	}


// parse raw - base58.encode(PERSON_DATA!!!)
function byteToPerson(raw){
	if (raw.length == 0) {
		alert("Byte code cannot be zero length.");
		return;
	}
	var position = 0;	
	var data = Base58.decode(raw);
	// type 
	var type = (data.slice(position,position+2));
	//console.log("type:"+type);
	position = position+2;
	// sender account
	var senderAccount = (data.slice(position,position+32));
	//console.log("type:" + senderAccount);
	position = position+32;
	var ss = [0,data[position]];
	//console.log("type:" + ss);
	var  nameLegt = byteToNum(ss);
	position = position+1;
	// name
	if (isIE()) {
		alert("Person parsing is not supported for Internet Explorer ");
	}
	if (isEDGE()) {
		alert("Person parsing is not supported for EDGE.");
	}
	var personName = new TextDecoder('UTF-8').decode(data.slice(position,position + nameLegt));
	position = position + nameLegt;
	var iconLeght = byteToNum(data.slice(position,position+2));
	position = position + 2;
	// icon
	var icon = data.slice(position, position + iconLeght);
	position = position + iconLeght;
	var imageLeght = byteToNum(data.slice(position, position+4));
	position = position + 4;
	// image
	var image = data.slice(position, position+ imageLeght);
	position = position + imageLeght;
	var descriptionLeght = byteToNum(data.slice(position, position+4));
	position = position + 4;
	// descriprion
	var description = new TextDecoder('UTF-8').decode(data.slice(position, position+ descriptionLeght));
	position = position + descriptionLeght;
	// birthday
	var birthday = byteToNum(data.slice(position, position+8));
	position = position + 8;
	// deathday
	var deathday  = byteToNum(data.slice(position, position+8));
	position = position + 8;
	// gender
	var gender = byteToNum(data.slice(position, position+1));
	position = position + 1; 
	var raceLength = byteToNum(data.slice(position, position+1));
	position = position + 1; 
	// race
	var race = new TextDecoder('UTF-8').decode(data.slice(position, position+raceLength));
	position = position + raceLength;
	//READ BIRTH LATITUDE
	var birthLatitude = bytesToFloat32(data.slice(position, position + 4));
	position = position + 4;
	//READ BIRTH LONGITUDE
	var birthLongitude =  bytesToFloat32(data.slice(position, position + 4));
	position = position + 4;
	//READ SKIN COLOR LENGTH
	var skinColorLength = byteToNum(data.slice(position, position + 1));
	position = position + 1;
	var skinColor = new TextDecoder('UTF-8').decode(data.slice(position, position + skinColorLength));
	position = position + skinColorLength;
	//READ EYE COLOR LENGTH
	var eyeColorLength = byteToNum(data.slice(position, position+1));
	position = position + 1;
	var eyeColor = new TextDecoder('UTF-8').decode(data.slice(position, position + eyeColorLength));
	position = position + eyeColorLength;
	//READ HAIR COLOR LENGTH
	var hairColorLength = byteToNum(data.slice(position, position+1));
	position = position + 1;
	var  hairColor = new TextDecoder('UTF-8').decode(data.slice(position, position + hairColorLength));
	position = position + hairColorLength;
	//READ HEIGHT
	var height = byteToNum(data.slice(position, position+1));
	position = position + 1;
	var ownerSignature;
	if (type[1] == 1)	{
		// with signature
		//READ SIGNATURE
		ownerSignature = data.slice(position, position + 64);
		position = position + 64;
	} else {
		ownerSignature = [];
	}
			
	var person = new Number();
	person["type"] = type;
	person["senderAccount"] = senderAccount; 		
	person["personName"] = personName;
	person["icon"] = icon;
	person["image"] = image;
	person["description"] = description;
	person["birthday"] = birthday;
	person["deathday"] = deathday;
	person["gender"] = gender;
	person["race"] = race;
	person["birthLatitude"] = birthLatitude;
	person["birthLongitude"] = birthLongitude;
	person["skinColor"] = skinColor;
	person["eyeColor"] = eyeColor;
	person["hairColor"] = hairColor;
	person["height"] = height;
	person["ownerSignature"] = ownerSignature;
	return person;
			
	}
// raw SertifyPubKeys for Person transaction
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// person_key		- Person key. (int)
// publicKey		- Public key. (byte[32])
// day				- day (int)
// port				- ERA network PORT 9046 or dev:9066 (int)
// R_SertifyPubKeys(keyPair, 1514529622881, 3, byte[32], 365, 9046)
// return byte[]
function R_SertifyPubKeys(keyPair, timestamp, person_key, publicKey, day, port){
	// type transaction
	const typeBytes = [36,0,1,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	var data1 = new Uint8Array();
	data1 = appendBuffer(data1, int64ToBytes(person_key));		// person key long
	data1 = appendBuffer(data1, Base58.decode(publicKey)); 					// public kee addresses
	data1 = appendBuffer(data1, int32ToBytes(day)); 			// day
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// raw Vouch transaction
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// blockHeigth		- block heigth (int)
// transNamber		- transaction number (int)
// port				- ERA network PORT 9046 or dev:9066 (int)
// R_Vouch(keyPair, 1514529622881, 200, 1, 9046)
// return byte
function R_Vouch(keyPair, timestamp, blockHeigth, transNamber, port){
	// type transaction
	const typeBytes = [40,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	var data1 = new Uint8Array();
	data1 = appendBuffer(data1, int32ToBytes(blockHeigth)); 			// Block Heigth
	data1 = appendBuffer(data1, int32ToBytes(transNamber)); 			// Transaction number from block
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// raw write Hashes transaction
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// name				- name (String)
// hashes[]			- Hashes[] (byte[])
// description		- Description (String)
// port				- ERA network PORT 9046 or dev:9066 (int)
// write_Hashes(keyPair, 1514529622881, "Haseshes name", hashes[], "Hashes description", 9046)
// return byte[]
function write_Hashes(keyPair, timestamp, name, hashes, description, port){
	// type transaction
		if (hashes.lignth > 65534) return;
		// size hashes to 4 byte
		hash_l = int32ToBytes(hashes.length);
		var typeBytes = [41,0,hash_l[2],hash_l[3]];
		// timestamp
		const timestampBytes = int64ToBytes(timestamp);
		// referens
		const lastReferenceByte = [0,0,0,0,0,0,0,0];
		// Fee param
		const fee_c = [0];
		var data0 = new Uint8Array();
		// start part
		data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
		
		var data1 = new Uint8Array();
		// title
		var arr = toUTF8Array(name);
		data1 = appendBuffer(data1, [arr.length]); 				// title lenght
		data1 = appendBuffer(data1, arr );			// title
		// description
		arr = toUTF8Array(description);
		data1 = appendBuffer(data1, int32ToBytes(arr.length)); 	// description lenght
		data1 = appendBuffer(data1, arr);			// description
		// Hashes part
		//data1 = appendBuffer(data1, toByteItemPart([1,unique], keyPair.publicKey, name, icon, image, description )); // item part
		for (i=0; i< hashes.length; i++){
		data1 = appendBuffer(data1, hashes[i]);
		}
		// end part
		return toByteEndPart(data0, data1, keyPair.privateKey, port );
	}

// raw issue status transaction
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// name				- name (String)
// icon				- Icon (byte[])
// image			- Image (byte[])
// description		- Description (String)
// unique			- unigue (0- unigue, 1- not unique)
// port				- ERA network PORT 9046 or dev:9066 (int)
// issue_Status(keyPair, 1514529622881, "Status name", byte[], byte[], "Status description", 0, 9046)
// return byte[]
function issue_Status(keyPair, timestamp, name, icon, image, description, unique, port){
// type transaction
	const typeBytes = [25,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	var data1 = new Uint8Array();
	// item part
	data1 = appendBuffer(data1, toByteItemPart([1,unique], keyPair.publicKey, name, icon, image, description )); // item part
	// end part
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// raw Set status to item transaction
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// status_Key		- Status key (long)
// item_Type		- item type (int)
//										ASSET_TYPE = 1;
//										IMPRINT_TYPE = 2;
//										NOTE_TYPE = 3;
//										PERSON_TYPE = 4;
//										STATUS_TYPE = 5;
//										UNION_TYPE = 6;
// item_Key			- Item key (long)
// date_Start		- date start. Unix timestamp (Long). 1514529622881
// date_End			- data end. Unix timestamp (Long). 1514529622881
// value1			- Value %1. (int)
// value2			- Value %2. (int)
// string1			- String 3%. (String)
// string2			- String 4%. (String)
// refToParent		- refer to parent (long)
// description		- String 5%. (String)
// port				- ERA network PORT 9046 or dev:9066 (int)
// R_SetStatusToItem(keyPair, 1514529622881, 1, 1, 1, 1514529622881, 1514529622881, 3, 10, "string1", "string2", 0, "description"  , 9046)
// return byte[]
function R_SetStatusToItem(keyPair, timestamp, status_Key, item_Type, item_Key, date_Start, date_End, value1, value2, string1, string2, refToParent, description   , port){
	// type transaction
	var arr = [];
	var params = 0;
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	var data1 = new Uint8Array();
	data1 = appendBuffer(data1, int64ToBytes(status_Key)); 			//KEY STATUS	BYTE[8]	Long
	data1 = appendBuffer(data1, [item_Type]); 						//ITEM TYPE	BYTE[1]	Int
	data1 = appendBuffer(data1, int64ToBytes(item_Key));			//KEY ITEM	BYTE[8]	Long
	data1 = appendBuffer(data1, int64ToBytes(date_Start));			//DATA START	BYTE[8]	Long
	data1 = appendBuffer(data1, int64ToBytes(date_End));			//DATA END	BYTE[8]	Long
	if (value1 != null && value1 != 0)
	{
		params +=1;
		data1 = appendBuffer(data1, int64ToBytes(value1));				//VALUE1	BYTE[8]	Long
	}
	if(value2 != null && value2 != 0)
	{
		params +=2;
		data1 = appendBuffer(data1, int64ToBytes(value2));				//VALUE2	BYTE[8]	Long
	}
	if (string1 != null && string1 != ""){
		params +=4;
		arr = toUTF8Array(string1);
		data1 = appendBuffer(data1, [arr.length]); 						// DATA1 LENGTH	BYTE[1]	INT
		data1 = appendBuffer(data1, arr );								// DATA	BYTE[DATA1 LENGTH]	STRING
	}
	if (string2 != null && string2 != ""){
		params +=8;
		arr = toUTF8Array(string2);
		data1 = appendBuffer(data1, [arr.length]); 						// DATA2 LENGTH	BYTE[1]	INT
		data1 = appendBuffer(data1, arr );								// DATA	BYTE[DATA2 LENGTH]	STRING
	}
	if (refToParent !=null && refToParent !=0){
		params +=16;
		data1 = appendBuffer(data1, int64ToBytes(refToParent));			//REF TO PARENT	BYTE[8]	Long
	}
	if (description != null && description != ""){
		params +=32;
		data1 = appendBuffer(data1, toUTF8Array(description));			// DESCRIPTION	BYTE[]	STRING
	}
		var typeBytes = [37,0,0,params];
		data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// Create Order
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// have_asset		- key have Asset (Long)
// want_asset		- key want Asset (Long)
// have_ammount		- have amount (Float)  100.23
// want_ammount		- want amount (Float) 122.03
// port				- ERA network PORT 9046 or dev:9066 (int)
// Create_Order(keyPair, 1514529622881, 1, 2, 100.23, 122.03, 9046)
function Create_Order(keyPair, timestamp, have_asset, want_asset, have_ammount, want_ammount, port){
// type transaction
	const typeBytes = [50,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	var data1 = new Uint8Array();
	// item part
	data1 = appendBuffer(data1, int64ToBytes(have_asset));  // item part
	data1 = appendBuffer(data1, int64ToBytes(want_asset));  // item part
	data1 = appendBuffer(data1, int64ToBytes(parseFloat(have_ammount * 100000000)));  // item part
	data1 = appendBuffer(data1, int64ToBytes(parseFloat(want_ammount * 100000000)));  // item part
	// end part
	$("#orderSign").val(getSignEndPart(data0, data1, keyPair.privateKey, port ));
	return toByteEndPart(data0, data1, keyPair.privateKey, port );
}
// Cancel Order
// keyPair			- pair public key + security key (byte64, byte32)
// timestamp		- Unix timestamp (Long). 1514529622881
// order_sign		- Signature Order byte[]
// port				- ERA network PORT 9046 or dev:9066 (int)
// Cancel_Order(keyPair, 1514529622881, byte[], 9046)
function Cancel_Order(keyPair, timestamp, order_sign, port){
// type transaction
	const typeBytes = [51,0,0,0];
	// timestamp
	const timestampBytes = int64ToBytes(timestamp);
	// referens
	const lastReferenceByte = [0,0,0,0,0,0,0,0];
	// Fee param
	const fee_c = [0];
	var data0 = new Uint8Array();
	// start part
	//tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	//data = appendBuffer(data, typeBytes);
	//data = appendBuffer(data, timestampBytes);
	//data = appendBuffer(data, lastReferenceByte);
	//data = appendBuffer(data, publicKey);
	//data = appendBuffer(data, fee_c);
	data0 = tobyteBasePart(typeBytes, timestampBytes, lastReferenceByte, keyPair.publicKey, fee_c);
	// end part
	//var data2 = getSignEndPart(data0, order_sign, keyPair.privateKey, port );
	//data2 = appendBuffer(data0, data2);
	//data2 = appendBuffer(data2, order_sign);
	return toByteEndPart(data0, order_sign, keyPair.privateKey, port);//data2;
}

function generateSignatureArbitraryTransactionV3(keyPair, lastReference, service, arbitraryData, fee, timestamp) {
	const data = generateArbitraryTransactionV3Base(keyPair.publicKey, lastReference, service, arbitraryData, fee, timestamp);
	return nacl.sign.detached(data, keyPair.privateKey);
}

function generateArbitraryTransactionV3(keyPair, lastReference, service, arbitraryData, fee, timestamp, signature) {
	return appendBuffer(generateArbitraryTransactionV3Base(keyPair.publicKey, lastReference, service, arbitraryData, fee, timestamp), 
		signature);
}

function generateArbitraryTransactionV3Base(publicKey, lastReference, service, arbitraryData, fee, timestamp) {
	const txType = TYPES.ARBITRARY_TRANSACTION;
	const typeBytes = int32ToBytes(txType);
	const timestampBytes = int64ToBytes(timestamp);
	const feeBytes = int64ToBytes(fee * 100000000);
	const serviceBytes = int32ToBytes(service);
	const dataSizeBytes = int32ToBytes(arbitraryData.length);
	const paymentsLengthBytes = int32ToBytes(0);  // Support payments - not yet.
	var data = new Uint8Array();
	data = appendBuffer(data, typeBytes);
	data = appendBuffer(data, timestampBytes);
	data = appendBuffer(data, lastReference);
	data = appendBuffer(data, publicKey);
	data = appendBuffer(data, paymentsLengthBytes);
	// Here it is necessary to insert the payments, if there are
	data = appendBuffer(data, serviceBytes);
	data = appendBuffer(data, dataSizeBytes);
	data = appendBuffer(data, arbitraryData);
	data = appendBuffer(data, feeBytes);
	return data;
}


function generateSignatureRegisterNameTransaction(keyPair, lastReference, owner, name, value, fee, timestamp) {
	const data = generateRegisterNameTransactionBase(keyPair.publicKey, lastReference, owner, name, value, fee, timestamp);
	return nacl.sign.detached(data, keyPair.privateKey);
}

function generateRegisterNameTransaction(keyPair, lastReference, owner, name, value, fee, timestamp, signature) {
	return appendBuffer( generateRegisterNameTransactionBase(keyPair.publicKey, lastReference, owner, name, value, fee, timestamp),	
		signature );
}

function generateRegisterNameTransactionBase(publicKey, lastReference, owner, name, value, fee, timestamp) {
	const txType = TYPES.REGISTER_NAME_TRANSACTION;
	const typeBytes = int32ToBytes(txType);
	const timestampBytes = int64ToBytes(timestamp);
	const feeBytes = int64ToBytes(fee * 100000000);
	const nameSizeBytes = int32ToBytes(name.length);
	const valueSizeBytes = int32ToBytes(value.length);
	var data = new Uint8Array();
	data = appendBuffer(data, typeBytes);
	data = appendBuffer(data, timestampBytes);
	data = appendBuffer(data, lastReference);
	data = appendBuffer(data, publicKey);
	data = appendBuffer(data, owner);
	data = appendBuffer(data, nameSizeBytes);
	data = appendBuffer(data, name);
	data = appendBuffer(data, valueSizeBytes);
	data = appendBuffer(data, value);
	data = appendBuffer(data, feeBytes);
	return data;
}










