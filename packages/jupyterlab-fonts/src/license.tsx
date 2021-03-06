import * as React from 'react';

import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';

import { IFontFaceOptions } from '.';

import '../style/license.css';

const WRAPPER_CLASS = 'jp-LicenseViewer-wrapper';
const LICENSE_CLASS = 'jp-LicenseViewer';

export class LicenseViewer extends VDomRenderer<LicenseViewer.Model> {
  constructor(options: LicenseViewer.IOptions) {
    super(new LicenseViewer.Model(options));
  }
  protected render(): React.ReactElement<any> {
    this.addClass(WRAPPER_CLASS);
    let m = this.model;

    // Bail if there is no model.
    if (!m) {
      return <></>;
    }

    const text = m.licenseText ? <pre>{m.licenseText}</pre> : <></>;

    return (
      <div className={LICENSE_CLASS}>
        <h1>{m.font.name}</h1>
        <h2>{m.font.license.name}</h2>
        {text}
      </div>
    );
  }
}

export namespace LicenseViewer {
  export interface IOptions {
    font: IFontFaceOptions;
  }

  export class Model extends VDomModel {
    private _font: IFontFaceOptions;
    private _licenseText: string;
    private _licenseTextPromise: Promise<string>;

    constructor(options: IOptions) {
      super();
      this.font = options.font;
      console.log(this._font);
    }

    get font() {
      return this._font;
    }

    set font(font) {
      this._font = font;
      this.stateChanged.emit(void 0);
      this._licenseTextPromise = new Promise(async (resolve, reject) => {
        console.log('awaiting');
        this._licenseText = await this._font.license.text();
        console.log('resolved');
        this.stateChanged.emit(void 0);
        resolve(this._licenseText);
      });
    }

    get licenseText() {
      return this._licenseText;
    }

    get licenseTextPromise() {
      return this._licenseTextPromise;
    }
  }
}
