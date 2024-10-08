import exp from "constants";
import { gql } from "graphql-request";

export const CREATE_FEES_RECORD_MUTATION = gql`
  mutation CreateFeesRecord(
    $studentId: ID!
    $studentName: String!
    $amount: Float!
    $date_of_payment: Date!
    $status: String!
  ) {
    createFeesRecord(
      studentId: $studentId
      studentName: $studentName
      amount: $amount
      date_of_payment: $date_of_payment
      status: $status
    ) {
      id
      amount
      studentName
      date_of_payment
      status
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent(
    $id: ID!
    $name: String
    $contactInfo: String
    $class: String
    $feesAmount: Float
    $notes: String
    $timeSlot: String
  ) {
    updateStudent(
      id: $id
      name: $name
      contactInfo: $contactInfo
      class: $class
      feesAmount: $feesAmount
      notes: $notes
      timeSlot: $timeSlot
    ) {
      id
      name
      contactInfo
      class
      feesAmount
      notes
      timeSlot
    }
  }
`;
export const GET_TEACHER_BY_ID = gql`
  query GetTeacherById($id: ID!) {
    getTeacherById(id: $id) {
      id
      username
      email
    }
  }
`;

export const LOGIN_MUTATION = `
mutation LoginTeacher($email: String!, $password: String!) {
  loginTeacher(email: $email, password: $password) {
    token
    teacher {
      id
      username
      email
    }
  }
}
`;

export const GET_STUDENT_BY_ID_QUERY = gql`
  query GetStudentById($id: ID!) {
    getStudentById(id: $id) {
      id
      name
      contactInfo
      class
      feesAmount
      notes
      timeSlot
      joiningDate
      isActive
      feesRecords {
        id
        amount
        date_of_payment
        status
      }
      logs
    }
  }
`;

export const GET_ALL_STUDENTS_QUERY = `
  query {
    getAllStudents {
      id
      name
      class
      timeSlot
      isActive
    }
  }
`;

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
      id
      name
      contactInfo
      class
      feesAmount
      notes
      timeSlot
    }
  }
`;

export const SIGNUP_MUTATION = `
  mutation SignupTeacher($username: String!, $email: String!, $password: String!) {
    signupTeacher(username: $username, email: $email, password: $password) {
      token
      teacher {
        id
        username
        email
      }
    }
  }
`;

export const GET_STUDENT_LOGS_QUERY = gql`
  query GET_STUDENT_LOGS($id: ID!) {
  getStudentLogs(id: $id)
}

`;

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

export const TOGGLE_ACTIVE_STATUS_MUTATION = gql`
  mutation ToggleStudentActive($id: ID!) {
    toggleStudentActive(id: $id) {
      id
      isActive
    }
  }
`;

export const GET_MONTHLY_FEES_REPORT = gql`
  query GetMonthlyFeesReport($year: Int!, $month: Int!) {
    getMonthlyFeesReport(year: $year, month: $month) {
      paidFeesCount
      unpaidFeesCount
      paidStudents {
        studentId
        studentName
        amount
        date_of_payment
        status
      }
      unpaidStudents {
        id
        name
        contactInfo
        class
      }
    }
  }
`;
