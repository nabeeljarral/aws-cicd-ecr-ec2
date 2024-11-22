export type ILang = {[key: string]: string};

const isOldStyle = process.env.NEXT_PUBLIC_STYLE === '1';

export const langEn: ILang = {
    ProceedIMPS_UPI_QR: ' Please proceed with IMPS if you face any issues with UPI or QR payments.',
    Payment_Methods: 'Payment Methods',
    'Image Is Missing': 'Image Is Missing',
    "Don't use the same QR code to pay multiple times":
        "Don't use the same QR code to pay multiple times",
    '100% Secure Payments': '100% Secure Payments',
    'Enter 12 Digit UTR Number': 'Enter 12 Digit UTR Number',
    'How to find the UTR number ?': 'How to find the UTR number ?',
    'Please Check your payment application for UTR number':
        'Please Check your payment application for UTR number',
    'Click Here': 'Click Here',
    Submit: 'Submit',
    'Payment Process:': 'Payment Process:',
    'Scan QR Code or copy UPI Id': isOldStyle
        ? 'Scan QR Code or copy UPI Id'
        : 'Scan the QR code or copy the provided UPI ID.',
    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.': isOldStyle
        ? 'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.'
        : 'Open your payment app (PayTM, PhonePE, GooglePay, BHIM, etc.) and select the "Send Money" or "UPI Payment" option.',
    'Submit the correct UTR code': isOldStyle
        ? 'Submit the correct UTR code'
        : 'Enter the payment amount. Then, review the payment details and complete the transaction.',
    Amount: 'Amount',
    Timer: 'Timer',
    'Payment Data': 'Payment Data',
    'Then Submit the UTR code': 'Then Submit the UTR code',
    Watch_Video:'Watch a video for Quick Deposit Instructions',
    Account_Holders_Name:'Account Holders Name:',
    Account_Number : 'Account Number:',
    IMPS_Note:'Please ensure to enter the exact amount and proceed using UPI apps for successful deposit completion',
    Label_IMPS_Textfield:'Enter Transaction ID (UTR/ Reference No.)',
    IMPS_Description:'Enter this code in the Comments field when you make a deposit. If you do not enter the code, your payment may not be identified or credited to your account.',
    IMPS_Final_Note : 'Do not process RTGS/NEFT',
    Name:'Name',
    UPI_Block_Note:'Please do not mention a word xyz on your transaction otherwise your account will be blocked',
    Label_UPI_TextField:"Enter UTR/ Reference No./ UPI Ref. No.",
    UPI_Note:'Please do not mention a word xyz on your transaction otherwise your account will be blocked',
    UPI_Final_Note:'Enter this code in the Comments field when you make a deposit. If you do not enter the code, your payment may not be identified or credited to your account.',
    Download_QR:'Download QR',
    QR_Code_Note:"Don't use the same QR code to pay multiple times",
    QR_Note:' Please ensure to enter the exact amount and proceed using UPI apps for successful deposit completion',
    QR_Label_TextField:'Enter Transaction ID (UTR/ Reference No.)',
    QR_Final_Note:'*Enter this code in the Comments field when you make a deposit. If you do not enter the code, your payment may not be identified or credited to your account.',
    Under_Process:'Your Payment is Under Process',
    Upto1min:'This will take up to 1 minute',
    transaction_number:'Transaction Number', 
    Amount_paid:'Amount Paid',
    back_To_Site:'Back To Website',
};
export const langTamil: ILang = {
    ProceedIMPS_UPI_QR : ' UPI அல்லது QR கட்டணங்களில் ஏதேனும் சிக்கல்களை எதிர்கொண்டால், IMPS உடன் தொடரவும்.',
    Payment_Methods : 'பணம் தேர்வுகள்',
    'Scan QR Code To Pay': 'பணம் செலுத்த QR குறியீட்டை ஸ்கேன் செய்யவும்',
    'Image Is Missing': 'Image Is Missing',
    "Don't use the same QR code to pay multiple times":
        'ஒரே QR குறியீட்டை பல முறை பணம் செலுத்த பயன்படுத்த வேண்டாம்',
    '100% Secure Payments': '100% பாதுகாப்பான கொடுப்பனவுகள்',
    'Enter 12 Digit UTR Number': '12 இலக்க UTR எண்ணை உள்ளிடவும்',
    'How to find the UTR number ?': 'UTR எண்ணை எப்படி கண்டுபிடிப்பது?',
    'Please Check your payment application for UTR number':
        'உங்கள் கட்டண விண்ணப்பத்தை UTR எண்ணுக்குச் சரிபார்க்கவும்',
    'Click Here': 'இங்கே கிளிக் செய்யவும்',
    Submit: 'சமர்ப்பிக்கவும்',
    'Payment Process:': 'பணம் செலுத்தும் செயல்முறை',
    'Scan QR Code or copy UPI Id': 'QR కోడ్‌ని స్కాన్ చేయండి లేదా UPI Idని కాపీ చేయండి',
    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.':
    'మీ చెల్లింపు యాప్‌ల నుండి చెల్లించిన తర్వాత: PayTM,PhonePE, GooglePay, BHIM, మొదలైనవి.',
    'Submit the correct UTR code': 'సరైన UTRని సమర్పించండి',
    Amount: 'தொகை',
    Timer: 'టైమర్',
    'Payment Data': 'கட்டணத் தரவு',
    'Then Submit the UTR code': 'సరైన UTRని సమర్పించండి',
    Watch_Video:'விரைவான டெபாசிட் வழிமுறைகளுக்கான வீடியோவைப் பார்க்கவும்',
    Account_Holders_Name : 'கணக்கு வைத்திருப்பவர்களின் பெயர்:',
    Account_Number : 'கணக்கு எண்:',
    IMPS_Note:'சரியான தொகையை உள்ளிடுவதை உறுதிசெய்து, வெற்றிகரமான டெபாசிட்டை முடிக்க UPI ஆப்ஸைப் பயன்படுத்தவும்',
    Label_IMPS_Textfield:'பரிவர்த்தனை ஐடியை உள்ளிடவும் (UTR/ குறிப்பு எண்.)',
    IMPS_Description:'நீங்கள் டெபாசிட் செய்யும்போது கருத்துகள் புலத்தில் இந்தக் குறியீட்டை உள்ளிடவும். நீங்கள் குறியீட்டை உள்ளிடவில்லை எனில், உங்கள் பணம் அடையாளம் காணப்படாமலோ அல்லது உங்கள் கணக்கில் வரவு வைக்கப்படாமலோ இருக்கலாம்.',
    IMPS_Final_Note : 'RTGS/NEFT ஐச் செயல்படுத்த வேண்டாம்',
    Name:'பெயர்',
    UPI_Block_Note:'உங்கள் பரிவர்த்தனையில் xyz என்ற வார்த்தையைக் குறிப்பிட வேண்டாம் இல்லையெனில் உங்கள் கணக்கு தடுக்கப்படும்',
    Label_UPI_TextField:"UTR/ குறிப்பு எண்/ UPI Ref ஐ உள்ளிடவும். இல்லை",
    UPI_Note : 'உங்கள் பரிவர்த்தனையில் xyz என்ற வார்த்தையைக் குறிப்பிட வேண்டாம் இல்லையெனில் உங்கள் கணக்கு தடுக்கப்படும்',
    UPI_Final_Note:'நீங்கள் டெபாசிட் செய்யும்போது கருத்துகள் புலத்தில் இந்தக் குறியீட்டை உள்ளிடவும். நீங்கள் குறியீட்டை உள்ளிடவில்லை எனில், உங்கள் பணம் அடையாளம் காணப்படாமலோ அல்லது உங்கள் கணக்கில் வரவு வைக்கப்படாமலோ இருக்கலாம்.',
    Download_QR:'QR ஐப் பதிவிறக்கவும்',
    QR_Code_Note:"ஒரே QR குறியீட்டை பல முறை பணம் செலுத்த பயன்படுத்த வேண்டாம்",
    QR_Note:'சரியான தொகையை உள்ளிடுவதை உறுதிசெய்து, வெற்றிகரமான டெபாசிட்டை முடிக்க UPI ஆப்ஸைப் பயன்படுத்தவும்',
    QR_Label_TextField:'பரிவர்த்தனை ஐடியை உள்ளிடவும் (UTR/ குறிப்பு எண்.)',
    QR_Final_Note:'*நீங்கள் டெபாசிட் செய்யும்போது கருத்துகள் புலத்தில் இந்தக் குறியீட்டை உள்ளிடவும். நீங்கள் குறியீட்டை உள்ளிடவில்லை எனில், உங்கள் பணம் அடையாளம் காணப்படாமலோ அல்லது உங்கள் கணக்கில் வரவு வைக்கப்படாமலோ இருக்கலாம்.',
    Under_Process:'உங்கள் பணம் செலுத்துதல் செயல்பாட்டில் உள்ளது',
    Upto1min:'இது ஒரு நிமிடம் வரை ஆகும்',
    transaction_number:'பரிவர்த்தனை எண்',
    Amount_paid:'செலுத்திய தொகை',
    back_To_Site:'இணையதளத்திற்கு திரும்பி செல்லவும்'

};
export const langTelgu: ILang = {
    'Scan QR Code To Pay': 'చెల్లించడానికి QR కోడ్‌ని స్కాన్ చేయండి',
    ProceedIMPS_UPI_QR : ' మీరు UPI లేదా QR చెల్లింపులతో ఏవైనా సమస్యలను ఎదుర్కొంటే దయచేసి IMPSతో కొనసాగండి.',
    Payment_Methods : 'చెల్లింపు పద్ధతులు',
    'Image Is Missing': 'Image Is Missing',
    "Don't use the same QR code to pay multiple times":
    'అనేక సార్లు చెల్లించడానికి ఒకే QR కోడ్‌ని ఉపయోగించవద్దు',
    '100% Secure Payments': '100% సురక్షిత చెల్లింపులు',
    'Enter 12 Digit UTR Number': '12 అంకెల UTR సంఖ్యను నమోదు చేయండి',
    'How to find the UTR number ?': 'UTR సంఖ్యను ఎలా కనుగొనాలి?',
    'Please Check your payment application for UTR number':
    'దయచేసి UTR నంబర్ కోసం మీ చెల్లింపు దరఖాస్తును తనిఖీ చేయండి',
    'Click Here': 'ఇక్కడ నొక్కండి',
    Submit: 'సమర్పించండి',
    'Payment Process:': 'చెల్లింపు ప్రక్రియ',
    'Scan QR Code or copy UPI Id': 'QR குறியீட்டை ஸ்கேன் செய்யவும் அல்லது UPI ஐடியை நகலெடுக்கவும்',
    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.':
    'உங்கள் பேமெண்ட் ஆப்ஸிலிருந்து பணம் செலுத்திய பிறகு: PayTM,PhonePE, GooglePay, BHIM போன்றவை.',
    'Submit the correct UTR code': 'சரியான UTR ஐ சமர்ப்பிக்கவும்',
    Amount: 'మొత్తం',
    Timer: 'டைமர்',
    'Payment Data': 'చెల్లింపు డేటా',
    'Then Submit the UTR code': 'சரியான UTR ஐ சமர்ப்பிக்கவும்',
    Watch_Video:'త్వరిత డిపాజిట్ సూచనల కోసం వీడియోను చూడండి',
    Account_Holders_Name : 'ఖాతాదారుల పేరు:',
    Account_Number : 'ఖాతా సంఖ్య:',
    IMPS_Note:'దయచేసి ఖచ్చితమైన మొత్తాన్ని నమోదు చేసి, విజయవంతంగా డిపాజిట్ పూర్తి చేయడం కోసం UPI యాప్‌లను ఉపయోగించడం కొనసాగించండి',
    Label_IMPS_Textfield:'లావాదేవీ ID (UTR/ సూచన సంఖ్య) నమోదు చేయండి',
    IMPS_Description:'మీరు డిపాజిట్ చేసినప్పుడు వ్యాఖ్యల ఫీల్డ్‌లో ఈ కోడ్‌ను నమోదు చేయండి. మీరు కోడ్‌ను నమోదు చేయకుంటే, మీ చెల్లింపు గుర్తించబడకపోవచ్చు లేదా మీ ఖాతాలో జమ చేయబడదు.',
    IMPS_Final_Note : 'RTGS/NEFTని ప్రాసెస్ చేయవద్దు',
    Name:'పేరు',
    UPI_Block_Note:'దయచేసి మీ లావాదేవీపై xyz అనే పదాన్ని పేర్కొనవద్దు లేకపోతే మీ ఖాతా బ్లాక్ చేయబడుతుంది',
    Label_UPI_TextField:"UTR/ రిఫరెన్స్ నంబర్/ UPI రెఫ్‌ని నమోదు చేయండి. నం.",
    UPI_Note:'దయచేసి మీ లావాదేవీపై xyz అనే పదాన్ని పేర్కొనవద్దు లేకపోతే మీ ఖాతా బ్లాక్ చేయబడుతుంది',
    UPI_Final_Note:'మీరు డిపాజిట్ చేసినప్పుడు వ్యాఖ్యల ఫీల్డ్‌లో ఈ కోడ్‌ను నమోదు చేయండి. మీరు కోడ్‌ను నమోదు చేయకుంటే, మీ చెల్లింపు గుర్తించబడకపోవచ్చు లేదా మీ ఖాతాలో జమ చేయబడదు.',
    Download_QR:'QRని డౌన్‌లోడ్ చేయండి',
    QR_Code_Note:"అనేక సార్లు చెల్లించడానికి ఒకే QR కోడ్‌ని ఉపయోగించవద్దు",
    QR_Note:'దయచేసి ఖచ్చితమైన మొత్తాన్ని నమోదు చేసి, విజయవంతంగా డిపాజిట్ పూర్తి చేయడం కోసం UPI యాప్‌లను ఉపయోగించడం కొనసాగించండి',
    QR_Label_TextField:'లావాదేవీ ID (UTR/ సూచన సంఖ్య) నమోదు చేయండి',
    QR_Final_Note:'*మీరు డిపాజిట్ చేసినప్పుడు వ్యాఖ్యల ఫీల్డ్‌లో ఈ కోడ్‌ను నమోదు చేయండి. మీరు కోడ్‌ను నమోదు చేయకుంటే, మీ చెల్లింపు గుర్తించబడకపోవచ్చు లేదా మీ ఖాతాలో జమ చేయబడదు.',
    Under_Process:'మీ చెల్లింపు ప్రక్రియలో ఉంది',
    Upto1min:'ఇది 1 నిమిషం వరకు పట్టవచ్చు',
    transaction_number:'లావాదేవీ సంఖ్య',
    Amount_paid:'చెల్లించిన మొత్తం',
    back_To_Site:'వెబ్‌సైట్‌కు తిరిగి వెళ్ళండి'

};


export const langHindi: ILang = {
    ProceedIMPS_UPI_QR: 'यदि आपको UPI या QR भुगतान में कोई समस्या हो, तो कृपया IMPS के साथ आगे बढ़ें।',
    Payment_Methods: 'भुगतान के तरीके',
    'Image Is Missing': 'छवि उपलब्ध नहीं है',
    "Don't use the same QR code to pay multiple times": 'एक ही QR कोड का उपयोग करके कई बार भुगतान न करें',
    '100% Secure Payments': '100% सुरक्षित भुगतान',
    'Enter 12 Digit UTR Number': '12 अंकों का UTR नंबर दर्ज करें',
    'How to find the UTR number ?': 'UTR नंबर कैसे ढूंढें?',
    'Please Check your payment application for UTR number':
        'कृपया UTR नंबर के लिए अपने भुगतान एप्लिकेशन की जाँच करें।',
    'Click Here': 'यहाँ क्लिक करें',
    Submit: 'जमा करें',
    'Payment Process:': 'भुगतान प्रक्रिया:',
    'Scan QR Code or copy UPI Id': isOldStyle
        ? 'QR कोड स्कैन करें या UPI आईडी कॉपी करें'
        : 'QR कोड स्कैन करें या प्रदान की गई UPI आईडी कॉपी करें।',
    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.': isOldStyle
        ? 'अपने भुगतान ऐप से भुगतान करने के बाद: PayTM, PhonePE, GooglePay, BHIM, आदि।'
        : 'अपना भुगतान ऐप (PayTM, PhonePE, GooglePay, BHIM, आदि) खोलें और "पैसे भेजें" या "UPI भुगतान" विकल्प चुनें।',
    'Submit the correct UTR code': isOldStyle
        ? 'सही UTR कोड जमा करें'
        : 'भुगतान राशि दर्ज करें। फिर, भुगतान विवरण की समीक्षा करें और लेनदेन पूरा करें।',
    Amount: 'राशि',
    Timer: 'टाइमर',
    'Payment Data': 'भुगतान डेटा',
    'Then Submit the UTR code': 'फिर UTR कोड जमा करें',
    Watch_Video: 'त्वरित जमा निर्देशों के लिए वीडियो देखें',
    Account_Holders_Name: 'खाता धारक का नाम:',
    Account_Number: 'खाता संख्या:',
    IMPS_Note: 'कृपया सटीक राशि दर्ज करना सुनिश्चित करें और सफल जमा के लिए UPI ऐप्स का उपयोग करके आगे बढ़ें।',
    Label_IMPS_Textfield: 'लेनदेन आईडी (UTR/ संदर्भ संख्या) दर्ज करें',
    IMPS_Description:
        'जब आप जमा करते हैं, तो इस कोड को टिप्पणी क्षेत्र में दर्ज करें। यदि आप कोड दर्ज नहीं करते हैं, तो आपका भुगतान पहचाना या आपके खाते में जमा नहीं किया जा सकता है।',
    IMPS_Final_Note: 'RTGS/NEFT को प्रोसेस न करें',
    Name: 'नाम',
    UPI_Block_Note:
        'कृपया अपने लेनदेन पर xyz शब्द का उल्लेख न करें, अन्यथा आपका खाता ब्लॉक कर दिया जाएगा।',
    Label_UPI_TextField: 'UTR/ संदर्भ संख्या/ UPI रेफ. नं. दर्ज करें',
    UPI_Note:
        'कृपया अपने लेनदेन पर xyz शब्द का उल्लेख न करें, अन्यथा आपका खाता ब्लॉक कर दिया जाएगा।',
    UPI_Final_Note:
        'जब आप जमा करते हैं, तो इस कोड को टिप्पणी क्षेत्र में दर्ज करें। यदि आप कोड दर्ज नहीं करते हैं, तो आपका भुगतान पहचाना या आपके खाते में जमा नहीं किया जा सकता है।',
    Download_QR: 'QR डाउनलोड करें',
    QR_Code_Note: 'एक ही QR कोड का उपयोग करके कई बार भुगतान न करें',
    QR_Note:
        'कृपया सटीक राशि दर्ज करना सुनिश्चित करें और सफल जमा के लिए UPI ऐप्स का उपयोग करके आगे बढ़ें।',
    QR_Label_TextField: 'लेनदेन आईडी (UTR/ संदर्भ संख्या) दर्ज करें',
    QR_Final_Note:'*जब आप जमा करते हैं, तो इस कोड को टिप्पणी क्षेत्र में दर्ज करें। यदि आप कोड दर्ज नहीं करते हैं, तो आपका भुगतान पहचाना या आपके खाते में जमा नहीं किया जा सकता है।',
    Under_Process:'आपका भुगतान प्रक्रियाधीन है',
    Upto1min:'इसमें 1 मिनट तक का समय लगेगा',
    transaction_number:'लेनदेन संख्या',
    Amount_paid:'भुगतान की गई राशि',
    back_To_Site:'वेबसाइट पर वापस जाएं'
};

export const langMalayalam: ILang = {
    ProceedIMPS_UPI_QR: 'UPI അല്ലെങ്കിൽ QR പെയ്മെന്റുകളിൽ പ്രശ്നങ്ങൾ നേരിട്ടാൽ, IMPS ഉപയോഗിച്ച് തുടരുക.',
    Payment_Methods: 'പേയ്മെന്റ് രീതികൾ',
    'Image Is Missing': 'ചിത്രം ലഭ്യമല്ല',
    "Don't use the same QR code to pay multiple times": 'ഒരു QR കോഡ് പല തവണ പണം അടയ്ക്കാൻ ഉപയോഗിക്കരുത്',
    '100% Secure Payments': '100% സുരക്ഷിത പേയ്മെന്റുകൾ',
    'Enter 12 Digit UTR Number': '12 അക്കം ഉള്ള UTR നമ്പർ നൽകുക',
    'How to find the UTR number ?': 'UTR നമ്പർ എങ്ങനെ കണ്ടെത്താം?',
    'Please Check your payment application for UTR number': 'ദയവായി നിങ്ങളുടെ പേയ്മെന്റ് ആപ്പിൽ നിന്ന് UTR നമ്പർ പരിശോധിക്കുക.',
    'Click Here': 'ഇവിടെ ക്ലിക്ക് ചെയ്യുക',
    Submit: 'സമർപ്പിക്കുക',
    'Payment Process:': 'പേയ്മെന്റ് പ്രക്രിയ:',
    'Scan QR Code or copy UPI Id': isOldStyle
        ? 'QR കോഡ് സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ UPI ഐഡി പകർത്തുക'
        : 'QR കോഡ് സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ നൽകിയ UPI ഐഡി പകർത്തുക.',
    'After paying from your payment apps: PayTM,PhonePE, GooglePay,BHIM,etc.': isOldStyle
        ? 'നിങ്ങളുടെ പേയ്മെന്റ് ആപ്പിൽ നിന്ന് പണമടച്ചശേഷം: PayTM, PhonePE, GooglePay, BHIM, മുതലായവ.'
        : 'നിങ്ങളുടെ പേയ്മെന്റ് ആപ്പ് (PayTM, PhonePE, GooglePay, BHIM, മുതലായവ) തുറക്കുക, "പണം അയക്കുക" അല്ലെങ്കിൽ "UPI പേയ്മെന്റ്" ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.',
    'Submit the correct UTR code': isOldStyle
        ? 'സരിയായ UTR കോഡ് സമർപ്പിക്കുക'
        : 'പേയ്മെന്റ് തുക നൽകുക. തുടർന്ന്, പേയ്മെന്റ് വിശദാംശങ്ങൾ പരിശോധിക്കുക, ഇടപാട് പൂർത്തിയാക്കുക.',
    Amount: 'തുക',
    Timer: 'ടൈമർ',
    'Payment Data': 'പേയ്മെന്റ് ഡാറ്റ',
    'Then Submit the UTR code': 'അതിനു ശേഷം UTR കോഡ് സമർപ്പിക്കുക',
    Watch_Video: 'വേഗത്തിൽ ഡെപ്പോസിറ്റ് നിർദ്ദേശങ്ങൾക്കുള്ള വീഡിയോ കാണുക',
    Account_Holders_Name: 'അക്കൗണ്ട് ഉടമയുടെ പേര്:',
    Account_Number: 'അക്കൗണ്ട് നമ്പർ:',
    IMPS_Note: 'കൃത്യമായ തുക നൽകുന്നതായി ഉറപ്പാക്കുക, വിജയകരമായ ഡെപ്പോസിറ്റിന് UPI ആപ്പുകൾ ഉപയോഗിച്ച് തുടരുക.',
    Label_IMPS_Textfield: 'ഇടപാട് ഐഡി (UTR/ റഫറൻസ് നമ്പർ) നൽകുക',
    IMPS_Description:
        'നിങ്ങൾ ഡെപ്പോസിറ്റ് ചെയ്യുമ്പോൾ, ഈ കോഡ് കമന്റുകൾ ഫീൽഡിൽ നൽകുക. നിങ്ങൾ കോഡ് നൽകാത്ത പക്ഷം, നിങ്ങളുടെ പേയ്മെന്റ് തിരിച്ചറിയാനോ അക്കൗണ്ടിലേക്ക് ക്രെഡിറ്റ് ചെയ്യാനോ കഴിയില്ല.',
    IMPS_Final_Note: 'RTGS/NEFT പ്രോസസ്സ് ചെയ്യരുത്',
    Name: 'പേര്',
    UPI_Block_Note: 'നിങ്ങളുടെ ഇടപാടിൽ xyz എന്ന വാക്ക് വ്യക്തമാക്കരുത്, ഇല്ലെങ്കിൽ നിങ്ങളുടെ അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്യപ്പെടും.',
    Label_UPI_TextField: 'UTR/ റഫറൻസ് നമ്പർ/ UPI Ref. നമ്പർ നൽകുക',
    UPI_Note: 'നിങ്ങളുടെ ഇടപാടിൽ xyz എന്ന വാക്ക് വ്യക്തമാക്കരുത്, ഇല്ലെങ്കിൽ നിങ്ങളുടെ അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്യപ്പെടും.',
    UPI_Final_Note: 'നിങ്ങൾ ഡെപ്പോസിറ്റ് ചെയ്യുമ്പോൾ, ഈ കോഡ് കമന്റുകൾ ഫീൽഡിൽ നൽകുക. നിങ്ങൾ കോഡ് നൽകാത്ത പക്ഷം, നിങ്ങളുടെ പേയ്മെന്റ് തിരിച്ചറിയാനോ അക്കൗണ്ടിലേക്ക് ക്രെഡിറ്റ് ചെയ്യാനോ കഴിയില്ല.',
    Download_QR: 'QR ഡൗൺലോഡ് ചെയ്യുക',
    QR_Code_Note: 'ഒരു QR കോഡ് പല തവണ പണം അടയ്ക്കാൻ ഉപയോഗിക്കരുത്',
    QR_Note: 'കൃത്യമായ തുക നൽകുന്നതായി ഉറപ്പാക്കുക, വിജയകരമായ ഡെപ്പോസിറ്റിന് UPI ആപ്പുകൾ ഉപയോഗിച്ച് തുടരുക.',
    QR_Label_TextField: 'ഇടപാട് ഐഡി (UTR/ റഫറൻസ് നമ്പർ) നൽകുക',
    QR_Final_Note: '*നിങ്ങൾ ഡെപ്പോസിറ്റ് ചെയ്യുമ്പോൾ, ഈ കോഡ് കമന്റുകൾ ഫീൽഡിൽ നൽകുക. നിങ്ങൾ കോഡ് നൽകാത്ത പക്ഷം, നിങ്ങളുടെ പേയ്മെന്റ് തിരിച്ചറിയാനോ അക്കൗണ്ടിലേക്ക് ക്രെഡിറ്റ് ചെയ്യാനോ കഴിയില്ല.',
    Under_Process:'നിങ്ങളുടെ പേയ്‌മെൻ്റ് പ്രക്രിയയിലാണ്',
    Upto1min:'ഇതിന് 1 മിനിറ്റ് വരെ സമയമെടുക്കും',
    transaction_number:'ഇടപാട് നമ്പർ',
    Amount_paid:'നൽകിയ തുക',
    back_To_Site:'വെബ്സൈറ്റിലേക്ക് മടങ്ങുക'
};
