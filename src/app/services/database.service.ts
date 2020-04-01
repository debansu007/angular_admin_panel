import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

const url = "https://fcm.googleapis.com/fcm/send";
const key = "AAAAgzkJftw:APA91bG_XNFLykG7KG3MAdhH7spn9sLkL59SiIop3iLGVc6-y-MvlzdRVeSr5cslW01RrrgBPxUI66z1Ne-NkQjmOwKvf2x89izo9WBgst9kC5YqKUQEKoqKvQ75gB0nS7_QA-FarRyQ";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * @constructor{{DI will be pushed here}}
   */
  constructor(
    public afs: AngularFirestore,
    public http: HttpClient,
    public firestorage: AngularFireStorage
  ) { }

  /**
   * @function{{getAllUsers}}
   * @description{{get all users data}}
   */
  getAllUsers() {
    return this.afs.collection('users').valueChanges();
  }

  /**
   * @function{{getAllOrganization}}
   * @description{{get all organization data}}
   */
  getAllOrganization() {
    return this.afs.collection('users_organization').valueChanges();
  }

  /**
   * @function{{getOrganizationById}}
   * @description{{get organization data}}
   */
  getOrganizationById(id) {
    return this.afs.collection('users_organization').doc(id).valueChanges();
  }

  /**
   * @function{{getAllReports}}
   * @description{{get all reports data}}
   */
  getAllReports() {
    return this.afs.collection('file_reports').valueChanges();
  }

  /**
   * @function{{getReportsOfOrg}}
   * @description{{get reports of organization}}
   */
  getReportsOfOrg(id) {
    return this.afs.collection('file_reports', ref => ref.where('involved_parties.orgID', '==', id)).valueChanges();
  }

  /**
   * @function{{updateUser}}
   * @description{{update user data}}
   */
  updateUser(data: any) {
    return this.afs.collection('users').doc(data.id).update(data);
  }

  /**
   * @function{{getUserById}}
   * @description{{get user by id}}
   */
  getUserById(id) {
    return this.afs.collection('users').doc(id).valueChanges();
  }

  /**
   * @function{{getUserById}}
   * @description{{get user by id}}
   */
  getUserOrganizationById(id) {
    return this.afs.collection(`users/${id}/organization`).valueChanges();
  }

  /**
   * @function{{updateCompany}}
   * @description{{update company data}}
   */
  updateCompany(data: any) {
    return this.afs.collection('users_organization').doc(data.id).update(data);
  }

  getOrgById(id) {
    return this.afs.collection('users_organization').doc(id).valueChanges();
  }

  /**
   * @function{{updateReport}}
   * @description{{update report data}}
   */
  updateReport(data: any) {
    return this.afs.collection('file_reports').doc(data.id).update(data);
  }

  /**
   * @function{{deleteReport}}
   * @description{{delete report data}}
   */
  deleteReport(data: any) {
    return this.afs.collection('file_reports').doc(data.id).delete();
  }

  /**
   * @function{{sendPushNotification}}
   * @description{{send push notification method}}
   */
  sendPushNotification(title, message, regArr) {
    let update = {
      data: {
        title: title,
        message: message,
        sound: "default",
        visibility: 1
      },
      notification: {
        title: title,
        body: message,
        sound: "default",
        visibility: 1
      },
      registration_ids: regArr
    };
    console.log('update',update);
    let headers = new HttpHeaders(Object.assign({}, { 'Content-Type': 'application/json' }, {
      'Authorization': "key=" + key,
      "Cache-Control": "no-cache"
    }));
    return this.http.post(url, update, { headers: headers });
  }

  /**
   * @function{{saveTerms}}
   * @description{{save terms method}}
   */
  saveTerms(coll, docu, showHtml) {
    return this.afs.collection(coll).doc(docu).set({showHtml: showHtml}, {merge: true});
  }

  /**
   * @function{{getTerms}}
   * @description{{get terms method}}
   */
  getTerms(coll, docu) {
    return this.afs.collection(coll).doc(docu).valueChanges();
  }

  /**
   * @function{{storePdf}}
   * @description{{store pdf method}}
   */
  storePdf(file, folderName, fileName) {
    return this.firestorage.ref(`${folderName}/${fileName}`).putString(file, 'data_url');
  }
  
  /**
   * @function{{getFileUrl}}
   * @description{{get file url method}}
   */
  getFileUrl(folder, fileName) {
    return this.firestorage.ref(`${folder}/${fileName}`).getDownloadURL()
  }

  /**
   * @function{{stroreNoti}}
   * @description{{stroreNoti}}
   */
  stroreNoti(data) {
    data.id = this.afs.createId()
    return this.afs.collection('notifications').doc(data.id).set(data);
  }

  /**
   * @function{{getNotifications}}
   * @description{{get all admin notifications}}
   */
  getNotifications() {
    return this.afs.collection('admin_notifications').valueChanges();
  }

  /**
   * @function{{getNotificationsById}}
   * @description{{get all notifications by id}}
   */
  getNotificationsById(id) {
    return this.afs.collection('notifications').valueChanges();
  }
  
  /**
   * @function{{getNotificationsById}}
   * @description{{get all notifications by id}}
   */
  getNotificationsByOrgId(id) {
    return this.afs.collection('notifications', ref => ref.where('orgID','==',id)).valueChanges();
  }

  /**
   * @function{{insertOrganization}}
   * @description{{insert organization data}}
   */
  insertOrganization(data) {
    data.userid = data.claimedById;
    let bObj = {
      id: data.id,
      createdAt: 1569922366201,
      email: data.email,
      formatedAddress: data.formatedAddress,
      image: data.image,
      name: data.name,
      phone: data.phone,
      url: data.url,
      userid: data.claimedById,
      websiteUrl: data.websiteUrl
    };
    return this.afs.collection(`users/${data.claimedById}/organization/`).doc(data.claimedBusiness).set(bObj);
  }

  /**
   * @function{{deleteNotificationById}}
   * @description{{delete notification by Id}}
   */
  deleteNotificationById(id) {
    return this.afs.collection(`admin_notifications`).doc(id).delete();
  }

  /**
   * @function{{getReviewById}}
   * @description{{get review by id}}
   */
  storeResponse(data) {
    return this.afs.collection(`reviewers`).doc(data.id).update({ response : data.response });
  }

  /**
   * @function{{getReviewById}}
   * @description{{get review by id}}
   */
  getReviewById(id) {
    return this.afs.collection(`reviewers`).doc(id).valueChanges();
  }

}
