const { VITE_API_URL, VITE_API_TIMEOUT = 5000, VITE_API_VERSION = 'v1' } = import.meta.env;

export const API_CONFIG = {
  // BASE_URL: `${VITE_API_URL}/${VITE_API_VERSION}`, localhost:8001/api/v1
  BASE_URL: `${VITE_API_URL}/api`,
  TIMEOUT: VITE_API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json', //내가 서버로 보내는 데이터는 json이야
    Accept: 'application/json', //json으로 응답해줘.
  },
  withCredentials: true,
};

export const API_ENDPOINTS = {
  //필요한endpoint작성
  USERS: {
    BASE: '/users',
    LOGIN: '/users/login',
    SIGNUP: '/users/signup',
    ENROLLADMIN: '/users/enrolladmin',
    CHECK_USER_ID: '/users/check-user-id',
    CHECK_EMAIL: '/users/check-user-email',
    DELETEUSER: '/users/deleteUser',
    UPDATEUSER: 'users/updateinfo',
    UPLOADPROFILEIMAGE: '/profileimage',
    CONVERT_POINTS: (userId) => `/users/${userId}/point-conversion`,
    GET_VACATION_COUNT: (userId) => `/users/${userId}/vacation-count`,
  },
  COMPANY: {
    BASE: '/company',
    ENROLLCOMPANY: '/company/enrollcompany',
  },

  WORKATION: {
    BASE: '/workation',
    CREATE: '/workation/create',
    LIST: '/workation/list',
    INFO: '/workation/info',
    SUBMIT: '/workation/submit',
    UPDATE: '/workation/update',
    DELETE: '/workation/delete',
    SUBLIST: '/workation/sublist',
    SUBUPDATE: '/workation/subupdate',
    RETURNUPDATE: '/workation/returnupdate',
    MYLIST: '/workation/submylist',
    MYDELETE: '/workation/mydelete',
    FULLSUBLIST: '/workation/fullsublist',
    APPROVED_LIST: '/workation/approved-list',
  },
  ATTENDANCE: {
    BASE: '/attendance',
    CLOCK_IN: '/attendance/clock-in',
    CLOCK_OUT: '/attendance/clock-out',
    STATUS: '/attendance/status',
    LIST: '/attendance/list',
  },
  ADMIN: {
    BASE: '/admin',
    MemberManagement: '/admin/employeemanagement',
    getUnapprovedEmployees: '/admin/employeeapproval',
    approveUser: '/admin/',
    UpdateMemberRole: '/admin/memberrole/',
    getAllAttendanceByCompanyCode: '/admin/adminattendance',
    getTodayAttendance: '/admin/adminattendance/today',
    updateAttendTime: '/admin/adminattendance',
    getMemberAttendance: '/admin/adminattendance/filter',
  },
  VOTES: {
    BASE: '/votes',
    // 투표자 목록 조회 엔드포인트
    GET_VOTERS: (voteNo, voteContentNo) => `/votes/${voteNo}/options/${voteContentNo}/voters`,
  },

  CHALLENGE: {
    BASE: '/challenges',
    DETAIL: (challengeNo) => `/challenges/${challengeNo}`,
    COMPLETE: (challengeNo) => `/challenges/${challengeNo}/complete`,
    COMPLETIONS: (challengeNo) => `/challenges/${challengeNo}/completions`,
    MY_COMPLETIONS: (challengeNo) => `/challenges/${challengeNo}/my-completions`, // 나의 인증글 목록 엔드포인트 추가
    CHECK_ACTIVE: '/challenges/active-status',
    MY_CHALLENGES: '/challenges/my',
    COMPLETION_DETAIL: (completionNo) => `/challenges/completion/${completionNo}`, // 인증글 상세 조회 엔드포인트 추가
    CHALLENGEFORDASHBOARD: (userId) => `/challenges/getChallenge/${userId}`,
  },

  BOARD: {
    BASE: '/boards',
    DETAIL: (id) => `/boards/${id}`,
    CREATE: '/boards',
    UPDATE: (id) => `/boards/${id}`,
    DELETE: (id) => `/boards/${id}`,
    INCREASE_VIEW: (id) => `/boards/${id}/views`,
    NOTICE: (id) => `/boards/getnotice/${id}`,
  },

  CATEGORY: {
    BASE: '/categories',
    DETAIL: (id) => `/categories/${id}`,
  },

  DEPARTMENT: {
    BASE: '/department',
    getDepartments: '/department',
  },

  HEALTH: {
    BASE: '/health',
    mentalquestion: '/health/mentalquestion',
    mentalresult: '/health/mentalquestion/result',
    physicalquestion: '/health/physicalquestion',
    physicalresult: '/health/physicalquestion/result',
    allresultList: '/health/allresult', //  결과 목록 추가
  },

  VACATION: {
    BASE: '/vacation',
    SUBMIT: '/vacation/submit',
    VACATIONLIST: '/vacation/list',
    LIST: '/vacation/list',
    WAITLIST: '/vacation/waitList',
    VADELETE: '/vacation/delete',

  },

  VACATIONADMIN: {
    getvacationlist: '/vacationadmin/getvactionlist',
    updateVacationStatus: '/vacationadmin/updateVacationStatus',
    getAllVacationList: '/vacationadmin/getAllVacationList',
    rejectVacation: '/vacationadmin/rejectVacation',
  },
};
