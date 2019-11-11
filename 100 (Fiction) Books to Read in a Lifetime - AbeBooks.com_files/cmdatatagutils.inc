<!--
/*
 * cmdatatagutils.js
 * $Id: cmdatatagutils - MASTER.txt 154281 2010-08-25 14:40:31Z wbird $
 * $Revision: 154281 $
 *
 * Version 4.1.0
 *
 * Coremetrics Tag v4.0, 8/7/2006
 * COPYRIGHT 1999-2002 COREMETRICS, INC. 
 * ALL RIGHTS RESERVED. U.S.PATENT PENDING
 *
 * The following functions aid in the creation of Coremetrics data tags.
 *
 * Date			Imp Eng			Desc
 * 08/04/06		Hutch White		Liveview Normalization List Update
 * 08/13/06		Hutch White		Add Endeca Tags
 * 12/20/06		Hutch White		Add Save For Later Tagging
 * 01/31/07		Kristen Golla	Added clientpin= and clientpw= to blacklist under myNormalize(). Also, added code to block in dest URL in Pageview and Registration tags
 * 10/09/08		Yolanda Hunt 	Enable client settings 
 *								Enable/ Updated Techprops cm.ul= varible to cm.ul=document.URL 
 * 10/23/08		HWHITE			Convert to maketag. Include with eluminate 4.2.3
 * 11/25/08		HWHITE			Add temporary order tag information parameters to pageview tag
 * 08/25/10		WBIRD		Added pageview pageURL and abeIDvalue - extrafields 4 and 5.
 * 09/08/10		WBIRD		Added pageURL and abeIDvalue to endecasearch, endecaclick, shop5 functions.
 *
 */

var cm_exAttr=new Array;  
var cm_ClientID = "90022313";
var cm_TrackLink = "A";
var cm_TrackImpressions = ""; 
var cm_JSFEnabled = false;

var cmJv = "1.0";
if (typeof(isNaN) == "function") cmJv = "1.1";
if (typeof(isFinite) == "function") cmJv = "1.2";
if (typeof(NaN) == "number") cmJv = "1.3";
if (typeof(decodeURI) == "function") cmJv = "1.5";
if (typeof(Array.forEach) == "function") cmJv = "1.6";
if (typeof(Iterator) == "object") cmJv = "1.7";

var cmCheckCMEMFlag = true;
  
/* TAG GENERATING FUNCTIONS */

/*
 * Calling this function points tags to the production database
 */
function cmSetProduction(){
	cm_HOST="data.abebooks.com/eluminate?"; 
}

var cmEndecaSearchTerm = new Array();
var cmEndecaDimension = new Array();
var cmEndecaDimensionValue = new Array();
var cmEndecaCounter = 0;
var cmpageURL = new Array();
var cmabeIDvalue = new Array();

function cmCreateEndecaSearch(searchTerm, dimension, dimensionValue, pageURL, abeIDvalue) {

	cmEndecaSearchTerm[cmEndecaCounter] = searchTerm;
	cmEndecaDimension[cmEndecaCounter] = dimension;
	cmEndecaDimensionValue[cmEndecaCounter] = dimensionValue;
	cmpageURL[cmEndecaCounter] = pageURL;
	cmabeIDvalue[cmEndecaCounter] = abeIDvalue;
	cmEndecaCounter++;
}

function cmDisplayEndecaSearch() {

	var i;

	var datestamp = new Date();
	var stamp = (Math.floor(Math.random() * 11111111)) + datestamp.valueOf();

	for(i=0; i<cmEndecaCounter;i++){
        cmMakeTag(["tid","7","li","10100","ps1",cmEndecaSearchTerm[i],"ps2",cmEndecaDimension[i],"ps3",cmEndecaDimensionValue[i],"ps4",stamp,"ps5",cmpageURL[i],"ps6",cmabeIDvalue[i]]);
	}

	cmEndecaCounter = 0;
}

function cmCreateEndecaClick(searchTerm, dimension, dimensionValue, pageURL, abeIDvalue) {

	cmEndecaSearchTerm[cmEndecaCounter] = searchTerm;
	cmEndecaDimension[cmEndecaCounter] = dimension;
	cmEndecaDimensionValue[cmEndecaCounter] = dimensionValue;
	cmpageURL[cmEndecaCounter] = pageURL;
	cmabeIDvalue[cmEndecaCounter] = abeIDvalue;
	cmEndecaCounter++;
}

function cmDisplayEndecaClick() {

	var i;

	var datestamp = new Date();
	var stamp = (Math.floor(Math.random() * 11111111)) + datestamp.valueOf();

	for(i=0; i<cmEndecaCounter;i++){
         cmMakeTag(["tid","7","li","10101","ps1",cmEndecaSearchTerm[i],"ps2",cmEndecaDimension[i],"ps3",cmEndecaDimensionValue[i],"ps4",stamp,"ps5",cmpageURL[i],"ps6",cmabeIDvalue[i]]);
	}

	cmEndecaCounter = 0;
}


function cmCreateManualImpressionTag(pageID, trackSP, trackRE) {
		// insert code to get pageID from cmTagControl if pageID is null
		cmMakeTag(["tid","9","pi",pageID,"cm_sp",trackSP,"cm_re",trackRE,"st",cm_ClientTS]);
}

function cmCreateManualLinkClickTag(href,name,pageID) {	
	if (cmCreateLinkTag == null && cM != null) {
		var cmCreateLinkTag = cM;
	}
	if (cmCreateLinkTag != null) {		
		var dt = new Date();
		cmLnkT3 = dt.getTime();
		href=cG7.normalizeURL(href,true);
		cmCreateLinkTag(cm_ClientTS, cmLnkT3, name, href, false, pageID);
	}
}

/* manual PageviewTag for off site page tagging.  Allows client to supply URL and Referring URL
*/
function cmCreateManualPageviewTag(pageID, categoryID,DestinationURL,ReferringURL) {
	cmMakeTag(["tid","1","pi",pageID,"cg",categoryID,"ul",DestinationURL,"rf",ReferringURL]);
}


function cmCreatePageElementTag(elementID, elementCategory, pageID, pageCategoryID, elementLocation,attributes) {
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}
	cmMakeTag(["tid","15","eid",elementID,"ecat",elementCategory,"pflg","0","pid",pageID,"pcat",pageCategoryID,"eloc",elementLocation,"cm_exAttr",cm_exAttr]);
}

function cmCreateProductElementTag(elementID, elementCategory, productID, productCategoryID, elementLocation,attributes) {
	if (attributes){
		cm_exAttr=attributes.split("-_-");
	}
	cmMakeTag(["tid","15","eid",elementID,"ecat",elementCategory,"pflg","1","pid",productID,"pcat",productCategoryID,"eloc",elementLocation,"cm_exAttr",cm_exAttr]);
}

/*
 * Creates a Tech Props tag.
 * pageID		: required. Page ID to set on this Pageview tag
 */
function cmCreateTechPropsTag(pageID, categoryID,attributes) {
	var tagList;

	if(pageID == null) { pageID = cmGetDefaultPageID(); }
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}

	tagList = ["tid", "6", "pi", pageID, "cg", categoryID, "pc", "Y", "cm_exAttr", cm_exAttr];

	cmMakeTag(tagList);
}

/*
 * Creates a Pageview tag with the given Page ID
 *
 * pageID	: required. Page ID to set on this Pageview tag
 * categoryID	: optional. Category ID to set on this Pageview tag
 * searchString	: optional. Internal search string enterred by user to reach
 *				  this page.
 *
 * 
 */
function cmCreatePageviewTag(pageID, categoryID, searchString, searchResults, searchFlag, attributes, orderID, customerID, orderTotal, pageURL, abeIDvalue, dataSource) {
	if (pageID == null) { pageID = cmGetDefaultPageID(); }
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}
	// Commenting out the following check as it is unnecessary:
	// if (searchFlag == "Y") {
	cmMakeTag(["tid","1","pi",pageID,"cg",categoryID,"se",searchString,"sr",searchResults,"pv1",orderID,"pv2",customerID,"pv3",orderTotal,"pv4",pageURL,"pv5",abeIDvalue,"pv6",dataSource,"cm_exAttr",cm_exAttr]);
}

function cmCreateListingDetailsPageviewTag(pageID, dataSource, listingId) {
	if (pageID == null) {
	  pageID = cmGetDefaultPageID();
	}

	cmMakeTag(["tid","1","pi",pageID,"pv6",dataSource,"cm_exAttr",[dataSource],"pv7",listingId]);
}


function getCookieValue(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);

  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
  }

  var end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }

  try {
    return decodeURI(dc.substring(begin + prefix.length, end));
  } catch(e) {
    return "";
  }
}

/*
 *
 * Creates a Pageview tag specific to SearchResults.
 * SearchResults populates an 'extra-field' that contains the backend
 * that serviced the search request
 *
 * Note:  I am not sure why we override cmCreatePageviewTag and have all
 *        this logic in javascript. I would think it would be easier to
 *        simply call the standard cmCreatePageviewTag that takes
 *        attributes & extra field lists seperated by "-"
 *
 */
function cmCreateSearchResultsPageviewTag(pageID, categoryID, searchString, searchResults, searchFlag,attributes,orderID,customerID,orderTotal,pageURL, abeIDvalue, searchService) {
  if (pageID == null) { pageID = cmGetDefaultPageID(); }
  if (attributes){
    var cm_exAttr=new Array;
    cm_exAttr=attributes.split("-_-");
  }

  cmMakeTag(["tid","1","pi",pageID,"cg",categoryID,"se",searchString,"sr",searchResults,"pv1",orderID,"pv2",customerID,"pv3",orderTotal,"pv4",pageURL,"pv5",abeIDvalue,"pv6",searchService,"cm_exAttr",cm_exAttr]);
}


/*
 * Creates a Pageview tag with the default value for Page ID. 
 * Format of Page ID is "x/y/z/MyPage.asp"
 *
 * 
 */
function cmCreateDefaultPageviewTag(categoryID) {
	cmCreatePageviewTag(cmGetDefaultPageID(), categoryID);
}

/*
 * Creates a Productview Tag
 * Also creates a Pageview Tag by setting pc="Y"
 * Format of Page ID is "PRODUCT: <Product Name> (<Product ID>)"
 *
 * productID	: required. Product ID to set on this Productview tag
 * productName	: required. Product Name to set on this Productview tag
 * categoryID	: optional. Category ID to set on this Productview tag 
 *
 * 
 */
function cmCreateProductviewTag(productID, productName, categoryID,attributes) {
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}
	cmMakeTag(["tid","5","pi","PRODUCT: "+productName+" ("+productID+")","pr",productID,"pm",productName,"cg",categoryID,"pc","N","cm_exAttr",cm_exAttr]);
}

function cmCreateProductviewTagMobile(productID, productName, categoryID,attributes) {
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}
	cmMakeTag(["tid","5","pi","PRODUCT_mobile: "+productName+" ("+productID+")","pr",productID,"pm",productName,"cg",categoryID,"pc","Y","cm_exAttr",cm_exAttr]);
}


/*
 * Variables and Arrays to support Lineitem Aggregation
 */
var __sArray = new Array();
var __skuString = "";
var __ex=new Array();

function __cmGetPIPC(__pr,__cg) {
	var __pI, i;
	var cmAttr1=new Array();
	var cmAttr2=new Array();
	for (i=0;i<__ex.length;++i){
		cmAttr1=cmAttr1+__ex[i];
	}		
	for (__pI = 0; __pI < __sArray.length; ++__pI) {
		if (__ex.length>0){
			cmAttr2=new Array();		
			for (i=__sArray[__pI].length-__ex.length*2+1;i<__sArray[__pI].length;i=i+2){
				cmAttr2=cmAttr2+__sArray[__pI][i];
			}
	
			if (__pr == __sArray[__pI][1] && __cg == __sArray[__pI][9] && cmAttr1==cmAttr2){
				return __pI;
			}
		} else {
		if (__pr == __sArray[__pI][1] && __cg == __sArray[__pI][9]) return __pI;
		}
	}
	return -1;
}

function cmAddShop(__v) {

	var __i = __cmGetPIPC(__v[1],__v[9]);
	if (__i == -1) {
		if (__ex.length>0){
			for (var i=0; i<__ex.length; ++i){
				__v[__v.length]="s_a"+(i+1);
				__v[__v.length]=__ex[i];
			}
		}
		__sArray[__sArray.length] = __v;
	}
	else {
		var __oQ = __sArray[__i][5];
		var __oP = __sArray[__i][7];
		__sArray[__i][5] = parseInt(__sArray[__i][5]) + parseInt(__v[5]);
		__sArray[__i][7] = (((__v[7]*__v[5])+(__oP*__oQ))/__sArray[__i][5]);
	}
}

/*
 * Creates a Shop tag with Action 5 (Shopping Cart)
 *
 * productID	: required. Product ID to set on this Shop tag
 * quantity	: required. Quantity to set on this Shop tag
 * productPrice	: required. Price of one unit of this product
 * categoryID	: optional. Category to set on this Shop tag
 *
 * 
 */
function cmCreateShopAction5Tag(productID,productName,productQuantity,productPrice,categoryID,attributes,pageURL,abeIDvalue) {
	var pattern = /[^\-0-9\.]/gi;
    productPrice = productPrice.toString().replace(pattern, "");
	var cm_slotNum;
	if (attributes){
		__ex=attributes.split("-_-");
	} else {
	__ex=new Array();
	}	

	cmAddShop(["pr",productID,"pm",productName,"qt",productQuantity,"bp",productPrice,"cg",categoryID,"sn",cm_slotNum,"at","5","tid","4","pc","N","sx1",pageURL,"sx2",abeIDvalue]);
}

/*
 * Creates a Shop tag with Action 9 (Order Receipt / Confirmed)
 *
 * productID	: required. Product ID to set on this Shop tag
 * productName	: required. Product Name to set on this Shop tag
 * quantity	: required. Quantity to set on this Shop tag
 * productPrice	: required. Price of one unit of this product
 * customerID	: required. ID of customer making the purchase
 * orderID	: required. ID of order this lineitem belongs to
 * orderTotal	: required. Total price of order this lineitem belongs to
 * categoryID	: optional. Category to set on this Shop tag
 *
 */
function cmCreateShopAction9Tag(productID,productName,productQuantity,productPrice,customerID,orderID,orderTotal,categoryID,attributes) {
	var cm_slotNum;
	var pattern = /[^\-0-9\.]/gi;
	var pattern1 = /^\s+|\s+$/gi;
    productPrice = productPrice.toString().replace(pattern, "");
	orderTotal = orderTotal.toString().replace(pattern, "");
	productID = productID.toString().replace(pattern1, "");
	if (attributes){
		__ex=attributes.split("-_-");
	} else {
	__ex=new Array();
	}
	
	cmAddShop(["pr",productID,"pm",productName,"qt",productQuantity,"bp",productPrice,"cg",categoryID,"sn",cm_slotNum,"cd",customerID,"on",orderID,"tr",orderTotal,"at","9","tid","4","pc","N"]);
	cmCalcSKUString();
}

function cmDisplayShop5s() {
	cmDisplayShops();
}

function cmDisplayShop9s(){
	cmCalcSKUString();
	cmDisplayShops();
}

function cmCalcSKUString() {
	__skuString = "";
	var __skuStringArray = new Array();
	for (var i = 0; i < __sArray.length; ++i) {
		// aggregate
		var __skuStringArrayIndex = -1;
		for (var y = 0; y < __skuStringArray.length; ++y) {
			if (__sArray[i][1] == __skuStringArray[y][0] ) {
				__skuStringArrayIndex = y;
			}
		}
		if (__skuStringArrayIndex == -1) {
			// it doesn't exist, so add it
			var newArrayIndex = __skuStringArray.length;
			__skuStringArray[newArrayIndex] = new Array();
			__skuStringArray[newArrayIndex][0] = __sArray[i][1];
			__skuStringArray[newArrayIndex][1] = __sArray[i][7];
			__skuStringArray[newArrayIndex][2] = __sArray[i][5];
		}
		else {
			// it exists, so update it
			var __oP = __skuStringArray[__skuStringArrayIndex][1];
			var __oQ = __skuStringArray[__skuStringArrayIndex][2];
			__skuStringArray[__skuStringArrayIndex][2] = parseInt(__sArray[i][5]) + __oQ;
			__skuStringArray[__skuStringArrayIndex][1] = (((__sArray[i][7]*__sArray[i][5])+(__oP*__oQ))/__sArray[i][5]);		
		}
	}
	for (var x = 0; x < __skuStringArray.length; ++x) {
		__skuString += "|"+__skuStringArray[x][0]+"|"+__skuStringArray[x][1]+"|"+__skuStringArray[x][2]+"|";
	}
}

function cmDisplayShops() {
	var i;
	for (i = 0; i < __sArray.length; ++i) {
		for (var l=0;l<__sArray[i].length;++l){
			if (__sArray[i][l]=="sn"){
				__sArray[i][l+1]=i.toString();
			}
		}
		cmMakeTag(__sArray[i]);
	}
	__sArray = new Array();
}


/*
 * Creates an Order tag
 *
 * orderID			: required. Order ID of this order
 * orderTotal		: required. Total of this order (minus tax and shipping)
 * orderShipping	: required. Shipping charge for this order
 * customerID		: required. Customer ID that placed this order
 * customerCity		: optional. City of Customer that placed this order
 * customerState	: optional. State of Customer that placed this order
 * customerZIP		: optional. Zipcode of Customer that placed this order
 *
 */
function cmCreateOrderTag(orderID,orderTotal,orderShipping,customerID,customerCity,customerState,customerZIP,attributes) {
	var pattern = /[^\-0-9\.]/gi;
    orderShipping = orderShipping.toString().replace(pattern, "");
	orderTotal = orderTotal.toString().replace(pattern, "");
	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}	
	cmMakeTag(["tid","3","osk",__skuString,"on",orderID,"tr",orderTotal,"sg",orderShipping,"cd",customerID,"ct",customerCity,"sa",customerState,"zp",customerZIP,"cm_exAttr",cm_exAttr]);
	__skuString = "";
}

/*
 * Creates a Conversion Event tag
 *
 * eventID			: required. Conversion event ID
 * actionType		: required. 1=conversion initiation, 2=conversion completion
 * categoryID		: optional. Category for the event
 * points			: optional. Point value to assign to conversion.
 */
 function cmCreateConversionEventTag(eventID, actionType, categoryID, points,attributes) {
 	if (attributes){
		var cm_exAttr=new Array;
		cm_exAttr=attributes.split("-_-");
	}
	cmMakeTag(["tid","14","cid",eventID,"cat",actionType,"ccid",categoryID,"cpt",points,"cm_exAttr",cm_exAttr]);
}

/*
 * Creates a Registration tag and/or a Newsletter tag
 *
 * customerID		: required for Registration. ID of Customer to register.
 * customerEmail	: required for Newsletters. Optional for Registration.
 * customerCity		: optional. City of Customer that placed this order
 * customerState	: optional. State of Customer that placed this order
 * customerZIP		: optional. Zipcode of Customer that placed this order
 * newsletterName	: required for Newsletters. The name of the Newsletter.
 * subscribe		: required for Newsletters. Either "Y" or "N"
 *
 */
function cmCreateRegistrationTag(customerID, customerEmail, customerCity,
				customerState, customerZIP, customerCountry, accountType
                , newsletterName, subscribe) {
	cmMakeTag(["tid","2","cd",customerID,"em",customerEmail,"ct",customerCity,"sa",customerState,"zp",customerZIP,"cy",customerCountry,"nl",newsletterName,"sd",subscribe,"rg11",accountType]);
}

/* Creates an Error Tag
 *
 */
function cmCreateErrorTag(pageID, categoryID) {
	if(pageID == null) {
		pageID = cmGetDefaultPageID();
	}
	cmMakeTag(["tid","404","pi",pageID,"cg",categoryID,"pc","Y"]);
}

function cmSiteWideABTestPageIdModifier(cmParams, cm) {
    var tid = cmParams[1];
    switch(tid) {
      case "1":
      case "5":
      case "6":
       var abCookie = getCookieValue("searchbox");
       if(abCookie == "7469B" && cmParams[3].indexOf("_B") == -1) {
         cmParams[3] += "_B";
       }
      break;
    }
}

function abeMakeExtraPageViewFields(__v, abePv) {
	"use strict";
	var key;
    for (key in abePv) {
        if (abePv.hasOwnProperty(key)) {
            __v.push(key, abePv[key]);
        }
    }
}

function addCidToPvTag(__v) {
	"use strict";
     __v.push("pv15", (getCookieValue("sock") || "0"));
}

function addLocationToPvTag(__v) {
	"use strict";
	 __v.push("pv4", location.href);
}


function addSitePromotionTags(__v) {
	"use strict";
	var stringHelper = new StringUtil();
	var urlMap = stringHelper.parseQuery(window.location.href);

	__v.push("pv13", stringHelper.getParamValue("cm_sp", urlMap));
}

function addSupplementedUrlTracking(__v) {
     var url = window.location.href || "";
     __v.push("pv14", url.substring(100,200));
}


function cmMakeTag(__v) {
    if (__v.length > 1 && __v[0] === "tid" && (__v[1] === "1" || __v[1] === "6")) {
        if (window.abePv) {
          abeMakeExtraPageViewFields(__v, abePv);
        }
        addCidToPvTag(__v);
        addLocationToPvTag(__v);
        addSitePromotionTags(__v);
        addSupplementedUrlTracking(__v);
    }

	var cm = new _cm("vn2", "e4.0");
	var i;
	for (i = 0; i < __v.length; i += 2) {
		var _n = __v[i];
		var _v = __v[i + 1];
		cm[_n] = _v;
	}
	
	var datestamp = new Date();	
	var stamp = (Math.floor(Math.random() * 11111111)) + datestamp.valueOf();	
	cm.rnd = stamp;
	
	if (cm.tid == "6") {
		cm.addTP();
		document.cookie = "cmTPSet=Y; path=/";
	}

	if (cm.tid == "1") {
		if (cI("cmTPSet") != 'Y') {
			cm.tid = "6";
	cm.pc = "Y";
			cm.addTP();
			document.cookie = "cmTPSet=Y; path=/";
		}
	}

	if (cm.tid != "4" && typeof(cm.cm_exAttr)!="undefined"){
		switch(cm.tid){
			case "6":
				prefix="pv";
				break;
			case "1":
				prefix="pv";
				break;
			case "5":
				prefix="pr";
				break;
			case "3":
				prefix="o";
				break;
			case "14":
				prefix="c";
				break;
			case "15":
				prefix="e";
				break;
			default:
				break;
		}		
		var attrNum=cm.cm_exAttr.length;
		if (attrNum>15){
			attrNum=15;
		}
		for (i=0;i<attrNum;i++){
			Attval=prefix+"_a"+(i+1);
			cm[Attval]=cm.cm_exAttr[i];
		}
		cm.cm_exAttr=null;
	}	
	if ((cm.pi == null) && (cm.pc == "Y")) {
		cm.pi = cmGetDefaultPageID();
	}

	try{
		if (parent.cm_ref != null) {
			cm.rf = parent.cm_ref;
			if (cm.pc == "Y") {
				parent.cm_ref = document.URL;
			}
		}
	
		// if parent had mmc variables and this is the first pageview, add mmc to this url
		if(parent.cm_set_mmc) {
			cm.ul = document.location.href + 
					((document.location.href.indexOf("?") < 0) ? "?" : "&") + 
					parent.cm_mmc_params; 
			if (cm.pc == "Y") {
				parent.cm_ref = cm.ul;
				parent.cm_set_mmc = false;
			}
		}
	}
	catch(err){}

	if (cm.ul == null) {
		cm.ul = window.location.href;
	}

	//check for zero price and zero quantity
	cmSafeZero(cm,["qt","bp","tr","sg"]);

	//check for manual_cm_mmc parameter;
	if (this.manual_cm_mmc != null) {
		cm.ul = cm.ul + ((cm.ul.indexOf("&") == -1) ? ((cm.ul.indexOf("?") == -1) ? "?" : "&") : "&") + "cm_mmc=" + this.manual_cm_mmc;
	}

	// convert MMC parameters to lowercase;
	cm.ul = cm.ul.replace(/cm_mmc/gi,"cm_mmc");
	cm.ul = cm.ul.replace(/cm_ven/gi,"cm_ven");
	cm.ul = cm.ul.replace(/cm_cat/gi,"cm_cat");
	cm.ul = cm.ul.replace(/cm_pla/gi,"cm_pla");
	cm.ul = cm.ul.replace(/cm_ite/gi,"cm_ite");
	if (cmCheckCMEMFlag){cmStartTagSet();}
	cm.writeImg();
	if (cmCheckCMEMFlag) {
		cmCheckCMEMFlag = false;	
		cmCheckCMEM();
		cmSendTagSet();		
	}
	
}

// HELPER FUNCTIONS -----------------------------------------------------------
/* These functions are used by the tag-generating functions and/or may be used
 * in in general as convenience functions
 */

/*
 * Creates an acceptable default Page ID value to use for Pageview tags.
 * The default Page ID is based on the URL, and consists of the path and
 * filename (without the protocol, domain and query string).
 * 
 * example:
 * returns "x/y/MyPage.asp" for the URL http://www.mysite.com/x/y/MyPage.asp
 */
function cmGetDefaultPageID() { 
	var pageName = window.location.pathname; 

	// eliminates everything after "?" (for Opera browswers)
	var tempIndex1 = pageName.indexOf("?");
	if (tempIndex1 != -1) {
		pageName = pageName.substr(0, tempIndex1);
	}
	// eliminates everything after "#" (for Opera browswers)
	var tempIndex2 = pageName.indexOf("#");
	if (tempIndex2 != -1) {
		pageName = pageName.substr(0, tempIndex2);
	}
	// eliminates everything after ";"
	var tempIndex3 = pageName.indexOf(";");
	if (tempIndex3 != -1) {
		pageName = pageName.substr(0, tempIndex3);
	}

	var slashPos = pageName.lastIndexOf("/");
	if (slashPos == pageName.length - 1) {
		pageName = pageName + "index.shtml"; /****************** SET TO DEFAULT DOC NAME */
	}

	while (pageName.indexOf("/") == 0) {
		pageName = pageName.substr(1,pageName.length);
	}

	return(pageName); 
} 

function cmIndexOfParameter (parameter, inString) {
	return inString.indexOf(parameter);
}

function cmExtractParameter (parameter, inString) {
    if (cmIndexOfParameter(parameter, inString) == -1) {
        return null;
    }
	var s = inString;
	var begin = s.indexOf(parameter);
	var end = s.indexOf("&", begin);
	if (end == -1) {
		end = s.length;
	}
	var middle = s.indexOf("=", begin);
	return s.substring(middle + 1, end);
}

function cmRemoveParameter (parameter, inString) {
    if (cmIndexOfParameter(parameter, inString) == -1) {
        return inString;
    }
	var s = inString;
	var begin = s.indexOf(parameter);
	var start = (begin - 1);
	var end = s.indexOf("&", begin);
	if (end == -1) {
		end = s.length;
	}
	if (s.substring(start, begin) == "?") {    // retain leading "?"
		start = (start + 1);
		end = (end + 1);
	}
	return s.substring(0, start) + s.substring(end, s.length);
}

function cmCheckCMEM() {
	if (cmIndexOfParameter("cm_em",document.location.href) != -1){
		var emailAddress = cmExtractParameter("cm_em",document.location.href);
		if (emailAddress.indexOf(":")>-1){
			emailAddress=emailAddress.substring(emailAddress.indexOf(":")+1);
		}
		cmCreateRegistrationTag(emailAddress,emailAddress);
	}
	if (cmIndexOfParameter("cm_lm",document.location.href) != -1){
		var emailAddress = cmExtractParameter("cm_lm",document.location.href);
		if (emailAddress.indexOf(":")>-1){
			emailAddress=emailAddress.substring(emailAddress.indexOf(":")+1);
		}		
		cmCreateRegistrationTag(emailAddress,emailAddress);
	}
}

function cmSafeZero(cm, checkArray) {
	// put logic here to convert number 0 to string "0"
	for (var i = 0; i < checkArray.length; ++i) {
		if ((cm[checkArray[i]] != null) && (cm[checkArray[i]] == 0)) {
			cm[checkArray[i]] = "0";
		}
	}
} 

if (defaultNormalize == null) { var defaultNormalize = null; }

function myNormalizeURL(url, isHref) {

    var newURL = url;
    
    if (isHref) {
	    var blackList = ["bx=","sts=","fe=","ds=","dj=","bi=","an=","y=","x=","n=","tn=","sortby=","kn=","imagefield.x=","imagefield.y=","ph=","vci=","vendorclientid=","bsi=","vwp=","sgnd=","vid=","searchurl","clientpin=","clientpw="];
	    var paramString;
	    var paramIndex = newURL.indexOf("?");
	    var params;
	    var keepParams = new Array();
	    var goodParam;
	
	    if (paramIndex > 0) {
		paramString = newURL.substring(paramIndex+1);
		newURL = newURL.substring(0, paramIndex);
		params = paramString.split("&");
	
		for(var i=0; i<params.length; i++) {
			goodParam = true;
			for(var j=0; j<blackList.length; j++) {
				if (params[i].indexOf(blackList[j]) == 0) {
					goodParam = false;
				}
			}
			if(goodParam == true) {
				keepParams[keepParams.length] = params[i];
			}
		}
		
		newURL += "?" + keepParams.join("&");
	
	    }
	 
	    if (defaultNormalize != null) {
	        newURL = defaultNormalize(newURL, isHref);
	    }
	}	
    return newURL;
}

// install normalization
if (document.cmTagCtl != null) {
    var func = "" + document.cmTagCtl.normalizeURL;
    if (func.indexOf('myNormalizeURL') == -1) {
        defaultNormalize = document.cmTagCtl.normalizeURL;
        document.cmTagCtl.normalizeURL = myNormalizeURL;
    }
}

//-->
