import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions'; 
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config';
import * as firebase from 'firebase';

export default class Transaction extends React.Component{
    constructor(){
        super()
        this.state={
            hasCameraPermission:null,
            scannedStudentID:"",
            scannedBookID:"",
            scanned:false,
            buttonState:"normal"
        }
    }
    handleTransaction=async()=>{
        var transactionMessage
        db.collection('books').doc(this.state.scannedBookID).get()
        .then((doc)=>{
            var book=doc.data()
            if(book.bookAvailability){
                this.initiateBookIssue()
                transactionMessage='book issue'
            }
            else{
                    this.initiateBookReturn()
                    transactionMessage='book return'
                
            }
        })
    }
    initiateBookIssue=async()=>{
        db.collection('transaction')
        .add({
            'studentID':this.state.scannedStudentID,
            'bookID':this.state.scannedBookID,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'issue',
        })
        db.collection('books').doc(this.state.scannedBookID).update({
            'bookAvailability':false,
        })
        db.collection('students').doc(this.state.scannedStudentID).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert("Book Issued.")
        this.setState({scannedBookID: '', scannedStudentID: ''})
    }
    initiateBookReturn=async()=>{
        db.collection('transaction')
        .add({
            'studentID':this.state.scannedStudentID,
            'bookID':this.state.scannedBookID,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'return',
        })
        db.collection('books').doc(this.state.scannedBookID).update({
            'bookAvailability':true,
        })
        db.collection('students').doc(this.state.scannedStudentID).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("Book Returned.")
        this.setState({scannedBookID: '', scannedStudentID: ''})
    }
    getCameraPermission=async(ID)=>{
        const{status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission:status==='granted',
            buttonState: ID,
            scanned:false
        })
    }
    handleBarcodeScan=async({type,data})=>{
        if(this.state.buttonState==="bookID"){
            this.setState({
                scannedBookID:data,
                scanned:true,
                buttonState:'normal'
            })
        }
        else if(this.state.buttonState==="studentID"){
            this.setState({
                scannedStudentID:data,
                scanned:true,
                buttonState:'normal'
            })
        }
    }
    render(){
        const hasCameraPermission=this.state.hasCameraPermission
        const buttonState=this.state.buttonState
        const scanned=this.state.scanned
        if(buttonState!=="normal" && hasCameraPermission){
            return(
                <BarCodeScanner onBarCodeScanned={scanned? undefined:this.handleBarcodeScan}
                    style={StyleSheet.absoluteFillObject}
                />
            )
        }else if(
            buttonState==='normal'
        ){
            return(
                <KeyboardAvoidingView style={styles.container}>
                    <View>
                        <Image source={require("../assets/booklogo.jpg")} style={{width: 200, height: 200}}/>
                        <Text style={{alignSelf:'center', fontSize: 20}}>Book Scanner</Text>
                    </View>
                    <View>
                        <TextInput style={styles.inputView}
                        placeholder="Student ID" 
                        onChangeText={(text)=>{this.setState({scannedStudentID:text})}}
                        value={this.state.scannedStudentID}/>
                        <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCameraPermission("studentID")}}><Text>Scan student ID.</Text></TouchableOpacity>
                        <TextInput style={styles.inputView}
                        placeholder="Book ID"
                        onChangeText={(text)=>{this.setState({scannedBookID:text})}}
                        value={this.state.scannedBookID}/>
                        <TouchableOpacity style={styles.scanButton} onPress={()=>{this.getCameraPermission("bookID")}}><Text>Scan book ID.</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={async()=>{this.handleTransaction()}}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )
        }
    }
}
const styles = StyleSheet.create({ 
    container:{ flex:1, justifyContent:'center', alignItems:'center' }, 
    textDisplay:{ fontSize:15, textDecorationLine:'underline' }, 
    buttonText:{ backgroundColor:'blue', padding:10, margin:10 }, 
    scanButton:{ backgroundColor:'aqua', padding:10, margin:10 }, 
    inputView:{ flexDirection:'row', margin:20 }, 
    inputBox:{ width:200, height:40, fontSize:20, padding:10, borderWidth:1.5, borderRightWidth:0, }, 
    submitButton:{ backgroundColor:'#FBC02D', width:100, height:50, marginTop:80 }, 
    submitButtonText:{ padding:10, textAlign:'center', fontSize:20, fontWeight:'bold', color:'white' }
})
