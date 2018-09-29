
'use strict';

require('dotenv').config();
var mysql = require('mysql');
var pool = require('./../../config/connection');
var nodemailer = require('nodemailer');
var transporter = require('./../../config/email');
var new_pass = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

var fs = require('fs');

exports.new = async function(account, email, role, message, token) {
	
    var email_template = fs.readFileSync('./templates/invite-email.html').toString();
    var attribution = 'Powered by <a href="https://pqy.one/curator" target="_blank"><em>Curator</em>.'; //Kindly leave this attribution intact
	
    var template = email_template.replace(/USER_NAME/gi, account);
    template = template.replace(/USER_TOKEN/gi, token);
    template = template.replace(/USER_EMAIL/gi, email);
    template = template.replace(/PROJECT_NAME/gi, process.env.PROJECT_NAME);
    template = template.replace(/PROJECT_HOMEPAGE/gi, process.env.PROJECT_HOMEPAGE);
    template = template.replace(/PROJECT_INFO/gi, process.env.PROJECT_INFO);
    template = template.replace(/PROJECT_ADDRESS/gi, process.env.PROJECT_ADDRESS);
    template = template.replace(/INVITE_MESSAGE/gi, message);
    template = template.replace(/ATTRIBUTION/gi, attribution);
	
	
    const mailOptions = {
        from: process.env.PROJECT_EMAIL, // sender address
        to: email, // list of receivers
        subject: 'Invitation to join ' + process.env.PROJECT_NAME + ' by ' + process.env.PROJECT_OWNER, // Subject line
        html: template // plain text body
    };
	
    try {
		
        transporter.sendMail(mailOptions);
        return 'OK';
		
    } catch (error) {
		
        console.log(error);
        return 'FAILED';
		
    }
	

};

exports.reset = function (account, email, token) {
	
	
    var email_template = fs.readFileSync('./templates/reset-email.html').toString();
    var attribution = 'Powered by <a href="https://pqy.one/curator" target="_blank"><em>Curator</em>.'; //Kindly leave this attribution intact
	
    var template = email_template.replace(/USER_NAME/gi, account);
    template = template.replace('RESET_TOKEN', token);
    template = template.replace(/PROJECT_NAME/gi, process.env.PROJECT_NAME);
    template = template.replace(/PROJECT_HOMEPAGE/gi, process.env.PROJECT_HOMEPAGE);
    template = template.replace(/PROJECT_INFO/gi, process.env.PROJECT_INFO);
    template = template.replace(/USER_EMAIL/gi, email);
    template = template.replace(/PROJECT_ADDRESS/gi, process.env.PROJECT_ADDRESS);
    template = template.replace(/ATTRIBUTION/gi, attribution);
	
	
    const mailOptions = {
        from: process.env.PROJECT_EMAIL, // sender address
        to: email, // list of receivers
        subject: 'Password reset for ' + process.env.PROJECT_NAME, // Subject line
        html: template // plain text body
    };
	
    try {
		
        transporter.sendMail(mailOptions);
        return 'OK';
		
    } catch (error) {
        console.log(error);
        return 'FAILED';
    }
	

	
};

exports.new_pass = function (account, email) {
	
	
    var email_template = fs.readFileSync('./templates/new-pass-email.html').toString();
    var attribution = 'Powered by <a href="https://pqy.one/curator" target="_blank"><em>Curator</em>.'; //Kindly leave this attribution intact
	
    var template = email_template.replace(/USER_NAME/gi, account);
    template = template.replace(/PROJECT_NAME/gi, process.env.PROJECT_NAME);
    template = template.replace(/PROJECT_HOMEPAGE/gi, process.env.PROJECT_HOMEPAGE);
    template = template.replace(/PROJECT_INFO/gi, process.env.PROJECT_INFO);
    template = template.replace(/PROJECT_ADDRESS/gi, process.env.PROJECT_ADDRESS);
    template = template.replace(/ATTRIBUTION/gi, attribution);
	
	
    const mailOptions = {
        from: process.env.PROJECT_EMAIL, // sender address
        to: email, // list of receivers
        subject: 'Password reset confirmation for ' + process.env.PROJECT_NAME, // Subject line
        html: template // plain text body
    };
	
    try {
		
        transporter.sendMail(mailOptions);
        return 'OK';
		
    } catch (error) {
        console.log(error);
        return 'FAILED';
    }
	

	
};







