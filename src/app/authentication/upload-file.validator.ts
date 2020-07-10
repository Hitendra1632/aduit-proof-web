import { FormControl } from '@angular/forms';

export function requiredFileType( type: string ) {
  return function ( control: FormControl ) {
    console.log(control);
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      console.log(extension.toLowerCase(),type.toLowerCase(), (type.toLowerCase() !== extension.toLowerCase()) )
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}