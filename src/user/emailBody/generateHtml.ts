export function generateProductHTML(product) {
  return `
        <td class="esd-structure es-p10t es-p10b es-p20r es-p20l esdev-adapt-off" align="left" esd-custom-block-id="388986">
          <table width="560" cellpadding="0" cellspacing="0" class="esdev-mso-table">
            <tbody>
              <tr>
                <td class="esdev-mso-td" valign="top">
                  <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                    <tbody>
                      <tr>
                        <td width="70" class="es-m-p0r esd-container-frame" align="center">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" class="esd-block-image" style="font-size: 0px;">
                                  <a target="_blank"><img class="adapt-img" src="${product.imgSrc}" alt style="display: block;" width="70"></a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="20"></td>
                <td class="esdev-mso-td" valign="top">
                  <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                    <tbody>
                      <tr>
                        <td width="265" class="esd-container-frame" align="center">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="left" class="esd-block-text">
                                  <p><strong>${product.name}</strong></p>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" class="esd-block-text es-p5t">
                                  <p>Size: ${product.size}<br>Color: ${product.color}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="20"></td>
                <td class="esdev-mso-td" valign="top">
                  <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                    <tbody>
                      <tr>
                        <td width="80" align="left" class="esd-container-frame">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="center" class="esd-block-text">
                                  <p>${product.quantity}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td width="20"></td>
                <td class="esdev-mso-td" valign="top">
                  <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                    <tbody>
                      <tr>
                        <td width="85" align="left" class="esd-container-frame">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td align="right" class="esd-block-text">
                                  <p>${product.price}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      `;
}