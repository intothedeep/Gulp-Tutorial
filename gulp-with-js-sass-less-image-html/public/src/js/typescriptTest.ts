class Person {
  fullName : string;

  constructor ( public firstName:string, public lastName:string) {
    this.fullName = firstName + " " + lastName;
  }

  onInit () {
    this.print;
  }

  print () : void {
    console.log(this.fullName);
  }

}
